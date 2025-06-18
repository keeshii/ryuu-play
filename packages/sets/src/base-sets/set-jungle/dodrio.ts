import {
  AttackEffect,
  CardType,
  CheckRetreatCostEffect,
  Effect,
  PlayerType,
  PokemonCard,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Dodrio extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Doduo';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 70;

  public powers = [
    {
      name: 'Retreat Aid',
      powerType: PowerType.POKEPOWER,
      text: 'As long as Dodrio is Benched, pay C less to retreat your Active Pokémon.'
    },
  ];

  public attacks = [
    {
      name: 'Rage',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '10+',
      text: 'Does 10 damage plus 10 more damage for each damage counter on Dodrio.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'JU';

  public name: string = 'Dodrio';

  public fullName: string = 'Dodrio JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;

      let hasDodrioOnBench = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, pokemonCard) => {
        if (pokemonSlot !== player.active && pokemonCard === this) {
          hasDodrioOnBench = true;
        }
      });

      if (!hasDodrioOnBench) {
        return state;
      }

      const index = effect.cost.indexOf(CardType.COLORLESS);
      if (index !== -1) {
        effect.cost.splice(index, 1);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage += effect.player.active.damage;
      return state;
    }

    return state;
  }
}
