import {
  AttackEffect,
  CardType,
  Effect,
  PlayerType,
  PokemonCard,
  SlotType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Magnemite extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Tackle',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
    {
      name: 'Magnetism',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: '10+',
      text: 'Does 10 damage plus 10 more damage for each Magnemite, Magneton, and Dark Magneton on your Bench.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Magnemite';

  public fullName: string = 'Magnemite TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const names = ['Magnemite', 'Magneton', 'Dark Magneton'];

      let benchedPokemon = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, pokemonCard, target) => {
        if (target.slot === SlotType.BENCH && names.includes(pokemonCard.name)) {
          benchedPokemon += 1;
        }
      });

      effect.damage += 10 * benchedPokemon;
    }

    return state;
  }
}
