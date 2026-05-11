import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  DealDamageEffect,
  Effect,
  GameError,
  GameMessage,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks, commonMarkers } from '../../common';

export class Nidoking extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Nidorino';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 120;

  public powers = [
    {
      name: 'Power Gene',
      powerType: PowerType.POKEBODY,
      text:
        'As long as Nidoking is in play, your attacks by Nidoran Female, Nidorina, Nidoqueen, Nidoran Male, and Nidorino do ' +
        '10 more damage to the Defending Pokémon.'
    },
  ];

  public attacks = [
    {
      name: 'Earth Poison',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: '40',
      text: 'If the Defending Pokémon already has any damage counters on it, the Defending Pokémon is now Poisoned.'
    },
    {
      name: 'Bound Crush',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Choose 1 of your opponent\'s Pokémon. This attack does 60 damage to that Pokémon. (Don\'t apply Weakness and ' +
        'Resistance for Benched Pokémon.) Nidoking can\'t use Bound Crush during your next turn.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Nidoking';

  public fullName: string = 'Nidoking RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const damageOpponentPokemon = commonAttacks.damageOpponentPokemon(this, store, state, effect);
    const duringYourNextTurn = commonMarkers.duringYourNextTurn(this, store, state, effect);

    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Attack not directed to the Defending Pokemon
      if (effect.target !== opponent.active) {
        return state;
      }

      let isNidokingInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, pokemonCard) => {
        if (pokemonCard === this) {
          isNidokingInPlay = true;
        }
      });

      if (!isNidokingInPlay) {
        return state;
      }

      const pokemonCard = effect.source.getPokemonCard();
      const names = ['Nidoran Female', 'Nidorina', 'Nidoqueen', 'Nidoran Male', 'Nidorino'];

      if (!pokemonCard || !names.includes(pokemonCard.name)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.damage += 10;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.damage > 0) {
        const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
        store.reduceEffect(state, specialConditionEffect);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      if (duringYourNextTurn.hasMarker(effect)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      // Can't use this attack next turn
      duringYourNextTurn.setMarker(effect);
      return damageOpponentPokemon.use(effect, 60);
    }

    return state;
  }
}
