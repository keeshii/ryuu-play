import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardTag,
  CardType,
  Effect,
  GameError,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  RetreatEffect,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Poliwrath extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Poliwhirl';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 120;

  public powers = [
    {
      name: 'Spiral',
      powerType: PowerType.POKEBODY,
      text: 'As long as Poliwrath is your Active Pokémon, your opponent\'s Confused Pokémon can\'t retreat.'
    },
  ];

  public attacks = [
    {
      name: 'Split Spiral Punch',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: 'The Defending Pokémon is now Confused.'
    },
    {
      name: 'Mega Throw',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50+',
      text: 'If the Defending Pokémon is Pokémon-ex, this attack does 50 damage plus 30 more damage.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Poliwrath';

  public fullName: string = 'Poliwrath RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Block retreat for opponent's Pokemon.
    if (effect instanceof RetreatEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!player.active.specialConditions.includes(SpecialCondition.CONFUSED)) {
        return state;
      }

      if (opponent.active.getPokemonCard() !== this) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(opponent, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = opponent.active.getPokemonCard();

      if (pokemonCard && pokemonCard.tags.includes(CardTag.POKEMON_EX)) {
        effect.damage += 30;
      }
    }

    return state;
  }
}
