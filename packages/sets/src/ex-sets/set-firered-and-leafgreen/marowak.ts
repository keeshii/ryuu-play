import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class Marowak extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Cubone';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Linear Attack',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: '',
      text:
        'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon. (Don\'t apply Weakness and ' +
        'Resistance for Benched Pokémon.)'
    },
    {
      name: 'Vengeance',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30+',
      text:
        'Does 30 damage plus 10 more damage for each Basic Pokémon and each Evolution card in your discard pile. ' +
        'You can\'t add more than 60 damage in this way.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Marowak';

  public fullName: string = 'Marowak RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const damageOpponentPokemon = commonAttacks.damageOpponentPokemon(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return damageOpponentPokemon.use(effect, 30);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const pokemons = player.discard.cards.filter(c => c instanceof PokemonCard);
      effect.damage += Math.min(pokemons.length, 6) * 10;
      return state;
    }

    return state;
  }
}
