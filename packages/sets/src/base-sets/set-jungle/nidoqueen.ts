import {
  AttackEffect,
  CardType,
  Effect,
  PlayerType,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Nidoqueen extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Nidorina';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 90;

  public attacks = [
    {
      name: 'Boyfriends',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: '20+',
      text: 'Does 20 damage plus 20 more damage for each Nidoking you have in play.'
    },
    {
      name: 'Mega Punch',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Nidoqueen';

  public fullName: string = 'Nidoqueen JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let nidokingsInPlay = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, pokemonCard) => {
        if (pokemonCard.name === 'Nidoking') {
          nidokingsInPlay++;
        }
      });

      effect.damage += 20 * nidokingsInPlay;
    }

    return state;
  }
}
