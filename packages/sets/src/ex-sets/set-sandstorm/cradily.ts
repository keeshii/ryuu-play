import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  ChoosePokemonPrompt,
  Effect,
  GameError,
  GameMessage,
  HealTargetEffect,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  RetreatEffect,
  SlotType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Cradily extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Lileep';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 100;

  public powers = [
    {
      name: 'Super Suction Cups',
      powerType: PowerType.POKEBODY,
      text: 'As long as Cradily is your Active Pokémon, your opponent\'s Pokémon can\'t retreat.'
    },
  ];

  public attacks = [
    {
      name: 'Lure Poison',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Before using this effect, you may switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon, ' +
        'if any. The Defending Pokémon is now Poisoned.'
    },
    {
      name: 'Spiral Drain',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: 'Remove 2 damage counters from Cradily (remove 1 if there is only 1).'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Cradily';

  public fullName: string = 'Cradily SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Block retreat for opponent's Pokemon.
    if (effect instanceof RetreatEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

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
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.pokemons.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: true }
        ),
        targets => {
          if (targets && targets.length > 0) {
            opponent.switchPokemon(targets[0]);
          }
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const healEffect = new HealTargetEffect(effect, 20);
      healEffect.target = player.active;
      return store.reduceEffect(state, healEffect);
    }

    return state;
  }
}
