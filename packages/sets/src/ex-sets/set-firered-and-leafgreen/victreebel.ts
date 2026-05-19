import {
  AttackEffect,
  BetweenTurnsEffect,
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class Victreebel extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Weepinbell';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 110;

  public powers = [
    {
      name: 'Acid Sampler',
      powerType: PowerType.POKEBODY,
      text:
        'As long as Victreebel is your Active Pokémon, put 1 damage counter on each Defending Pokémon between ' +
        'turns. Acid Sampler stops working if your other Active Pokémon is not a Victreebel.'
    },
  ];

  public attacks = [
    {
      name: 'Acid',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: 'The Defending Pokémon can\'t retreat until the end of your opponent\'s next turn.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Victreebel';

  public fullName: string = 'Victreebel RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const cantRetreat = commonAttacks.cantRetreat(this, store, state, effect);

    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.active.getPokemonCard() !== this) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      opponent.active.damage += 10;

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return cantRetreat.use(effect);
    }

    return state;
  }
}
