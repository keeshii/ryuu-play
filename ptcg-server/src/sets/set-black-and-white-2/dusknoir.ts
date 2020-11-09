import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect, PowerEffect } from "../../game/store/effects/game-effects";
import { StateUtils } from "../../game/store/state-utils";
import { PowerType } from "../../game/store/card/pokemon-types";
import { CheckPokemonStatsEffect, CheckHpEffect } from "../../game/store/effects/check-effects";
import { EndTurnEffect } from "../../game/store/effects/game-phase-effects";
import { PlayerType, SlotType } from "../../game/store/actions/play-card-action";
import { MoveDamagePrompt, DamageMap } from "../../game/store/prompts/move-damage-prompt";
import { GameMessage } from "../../game/game-message";


function* useSinisterHand(next: Function, store: StoreLike, state: State, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const maxAllowedDamage: DamageMap[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    const checkHpEffect = new CheckHpEffect(opponent, cardList);
    store.reduceEffect(state, checkHpEffect);
    maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
  });

  return store.prompt(state, new MoveDamagePrompt(
    effect.player.id,
    GameMessage.MOVE_DAMAGE,
    PlayerType.TOP_PLAYER,
    [ SlotType.ACTIVE, SlotType.BENCH ],
    maxAllowedDamage,
    { allowCancel: true }
  ), transfers => {
    if (transfers === null) {
      return;
    }

    for (const transfer of transfers) {
      const source = StateUtils.getTarget(state, player, transfer.from);
      const target = StateUtils.getTarget(state, player, transfer.to);
      if (source.damage >= 10) {
        source.damage -= 10;
        target.damage += 10;
      }
    }
  });
}

export class Dusknoir extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Dusclops';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 130;

  public weakness = [{ type: CardType.DARK }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Sinister Hand',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As often as you like during your turn (before your attack), ' +
      'you may move 1 damage counter from 1 of your opponent\'s Pokemon ' +
      'to another of your opponent\'s Pokemon.'
  }];

  public attacks = [{
    name: 'Shadow Punch',
    cost: [ CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 60,
    text: 'This attack\'s damage isn\'t affected by Resistance.'
  }];

  public set: string = 'BW2';

  public name: string = 'Dusknoir';

  public fullName: string = 'Dusknoir BC';

  public readonly SHADOW_PUNCH_MARKER = 'SHADOW_PUNCH_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      let generator: IterableIterator<State>;
      generator = useSinisterHand(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.SHADOW_PUNCH_MARKER, this);
      return state;
    }

    if (effect instanceof CheckPokemonStatsEffect && effect.target.marker.hasMarker(this.SHADOW_PUNCH_MARKER)) {
      effect.resistance = [];
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.marker.removeMarker(this.SHADOW_PUNCH_MARKER, this);
      return state;
    }

    return state;
  }

}
