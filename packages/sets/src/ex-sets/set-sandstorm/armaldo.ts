import {
  CardType,
  Effect,
  GameError,
  GameMessage,
  PlaySupporterEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Armaldo extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Anorith';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 120;

  public powers = [
    {
      name: 'Primal Veil',
      powerType: PowerType.POKEBODY,
      text: 'As long as Armaldo is your Active Pokémon, each player can\'t play any Supporter Cards.'
    },
  ];

  public attacks = [
    {
      name: 'Blade Arms',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: '60',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Armaldo';

  public fullName: string = 'Armaldo SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Block playing Pokemon Tools from hand
    if (effect instanceof PlaySupporterEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check each player active Pokemon
      if (player.active.getPokemonCard() !== this && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    return state;
  }
}
