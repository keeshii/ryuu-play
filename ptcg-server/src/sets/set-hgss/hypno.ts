import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SpecialCondition } from "../../game/store/card/card-types";
import { PowerType, StoreLike, State, StateUtils, ChoosePokemonPrompt, PlayerType,
  SlotType, PokemonCardList, GameError, CoinFlipPrompt } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { PowerEffect, AttackEffect } from "../../game/store/effects/game-effects";
import { PutDamageEffect } from "../../game/store/effects/attack-effects";
import { GameMessage } from "../../game/game-message";
import { PlayPokemonEffect } from "../../game/store/effects/play-card-effects";
import { EndTurnEffect } from "../../game/store/effects/game-phase-effects";

export class Hypno extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Drowzee';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Sleep Pendulum',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may flip a coin. ' +
      'If heads, the Defending Pokemon is now Asleep. This power can\'t be ' +
      'used if Hypno is affected by a Special Condition.'
  }];

  public attacks = [
    {
      name: 'Psychic Shot',
      cost: [ CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 30,
      text: 'Does 10 damage to 1 of your opponent\'s Benched Pokemon. ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokemon.)'
    }
  ];

  public set: string = 'HGSS';

  public name: string = 'Hypno';

  public fullName: string = 'Hypno HGSS';

  public readonly SLEEP_PENDULUM_MAREKER = 'SLEEP_PENDULUM_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.SLEEP_PENDULUM_MAREKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList | undefined;

      if (cardList === undefined) {
        throw new GameError(GameMessage.ILLEGAL_ACTION);
      }
      if (cardList.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.SLEEP_PENDULUM_MAREKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      player.marker.addMarker(this.SLEEP_PENDULUM_MAREKER, this);

      if (opponent.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
        return state;
      }

      state = store.prompt(state, new CoinFlipPrompt(
        player.id,
        GameMessage.COIN_FLIP
      ), result => {
        if (result) {
          opponent.active.addSpecialCondition(SpecialCondition.ASLEEP);
        }
      });

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_ONE_POKEMON,
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

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.SLEEP_PENDULUM_MAREKER, this);
    }

    return state;
  }


}
