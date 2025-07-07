import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CheckRetreatCostEffect,
  CoinFlipPrompt,
  Effect,
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

export class Volbeat extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public powers = [
    {
      name: 'Uplifting Glow',
      powerType: PowerType.POKEBODY,
      text: 'As long as Illumise is in play, Volbeat\'s Retreat Cost is 0.'
    },
  ];

  public attacks = [
    {
      name: 'Toxic Vibration',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, the Defending Pokémon is now Poisoned. If tails, the Defending Pokémon is now ' +
        'Asleep.'
    },
    {
      name: 'Pester',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: '20+',
      text:
        'If the Defending Pokémon is affected by a Special Condition, this attack does 20 damage plus 20 more ' +
        'damage.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Volbeat';

  public fullName: string = 'Volbeat SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect && effect.player.active.pokemons.cards.includes(this)) {
      const player = effect.player;

      if (player.active.getPokemonCard() !== this) {
        return state;
      }

      let hasIllumise = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, pokemonCard) => {
        if (pokemonCard.name === 'Illumise') {
          hasIllumise = true;
        }
      });

      // Illumise not in play
      if (!hasIllumise) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.cost = [];
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        const condition = result ? SpecialCondition.POISONED : SpecialCondition.ASLEEP;
        const specialConditionEffect = new AddSpecialConditionsEffect(effect, [condition]);
        store.reduceEffect(state, specialConditionEffect);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.specialConditions.length > 0) {
        effect.damage += 20;
      }
    }

    return state;
  }
}
