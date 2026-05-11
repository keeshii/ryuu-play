import {
  AttackEffect,
  CardType,
  CheckRetreatCostEffect,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Scyther extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public powers = [
    {
      name: 'Leaf Ride',
      powerType: PowerType.POKEBODY,
      text: 'If Scyther has any Energy attached to it, Scyther\'s Retreat Cost is 0.'
    },
  ];

  public attacks = [
    {
      name: 'Fury Cutter',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: '10+',
      text:
        'Flip 3 coins. If 1 of them is heads, this attack does 10 damage plus 10 more damage. If 2 of them are ' +
        'heads, this attack does 10 damage plus 20 more damage. If all of them are heads, this attack does 10 ' +
        'damage plus 40 more damage.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Scyther';

  public fullName: string = 'Scyther RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect && effect.player.active.pokemons.cards.includes(this)) {
      const player = effect.player;

      if (player.active.getPokemonCard() !== this) {
        return state;
      }

      // Energies attached to the active Pokemon
      if (player.active.energies.cards.length === 0) {
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
      return store.prompt(
        state,
        [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
        ],
        results => {
          let heads: number = 0;
          results.forEach(r => {
            heads += r ? 1 : 0;
          });
          effect.damage += heads === 3 ? 40 : heads * 10;
        }
      );
    }

    return state;
  }
}
