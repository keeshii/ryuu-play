import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { CoinFlipPrompt } from "../../game/store/prompts/coin-flip-prompt";
import { GameMessage } from "../../game/game-message";
import { AbstractAttackEffect, PutDamageEffect } from "../../game/store/effects/attack-effects";
import { StateUtils } from "../../game/store/state-utils";
import { PlayerType, SlotType } from "../../game/store/actions/play-card-action";
import { EndTurnEffect } from "../../game/store/effects/game-phase-effects";
import { ChoosePokemonPrompt } from "../../game/store/prompts/choose-pokemon-prompt";

function* useAquaJet(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {

  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Opponent doesn't have benched pokemon
  const hasBenched = opponent.bench.some(b => b.cards.length > 0);
  if (!hasBenched) {
    return state;
  }

  let flipResult = false;
  yield store.prompt(state, new CoinFlipPrompt(
    player.id, GameMessage.COIN_FLIP
  ), result => {
    flipResult = result;
    next();
  });

  if (!flipResult) {
    return state;
  }

  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
    PlayerType.TOP_PLAYER,
    [ SlotType.BENCH ],
    { allowCancel: false }
  ), targets => {
    if (!targets || targets.length === 0) {
      return;
    }
    const damageEffect = new PutDamageEffect(effect, 10);
    damageEffect.target = targets[0];
    store.reduceEffect(state, damageEffect);
  });
}


export class Floatzel extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Buizel';

  public cardType: CardType = CardType.WATER;

  public hp: number = 80;

  public weakness = [{
    type: CardType.LIGHTNING,
    value: 20
  }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Agility',
    cost: [ CardType.COLORLESS, CardType.COLORLESS ],
    damage: 20,
    text: 'Flip a coin. If heads, prevent all effects of an attack, ' +
      'including damage, done to Floatzel during your opponent\'s next turn.'
  }, {
    name: 'Aqua Jet',
    cost: [ CardType.WATER, CardType.WATER, CardType.COLORLESS ],
    damage: 60,
    text: 'Flip a coin. If heads, this attack does 10 damage to 1 ' +
      'of your opponent\'s Benched Pokemon. (Don\'t apply Weakness ' +
      'and Resistance for Benched Pokemon.)'
  }];

  public set: string = 'DP';

  public name: string = 'Floatzel';

  public fullName: string = 'Floatzel GE';

  public readonly CLEAR_AGILITY_MARKER = 'CLEAR_AGILITY_MARKER';

  public readonly AGILITY_MARKER = 'AGILITY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      state = store.prompt(state, new CoinFlipPrompt(
        player.id, GameMessage.COIN_FLIP
      ), flipResult => {
        if (flipResult) {
          player.active.marker.addMarker(this.AGILITY_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_AGILITY_MARKER, this);
        }
      });

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      let generator: IterableIterator<State>;
      generator = useAquaJet(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AbstractAttackEffect
      && effect.target.marker.hasMarker(this.AGILITY_MARKER)) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_AGILITY_MARKER, this)) {

      effect.player.marker.removeMarker(this.CLEAR_AGILITY_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.AGILITY_MARKER, this);
      });
    }

    return state;
  }

}
