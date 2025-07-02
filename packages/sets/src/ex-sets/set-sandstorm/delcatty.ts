import {
  AttackEffect,
  CardType,
  Effect,
  EnergyType,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Delcatty extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Skitty';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Scratch',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
    {
      name: 'Ultra Energy Source',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '10×',
      text:
        'Does 10 damage times the number of basic Energy cards attached to all of the Active Pokémon (both yours ' +
        'and your opponent\'s).'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Delcatty';

  public fullName: string = 'Delcatty SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let energies = 0;
      player.active.energies.cards.forEach(card => {
        if (card.energyType === EnergyType.BASIC) {
          energies += 1;
        }
      });

      opponent.active.energies.cards.forEach(card => {
        if (card.energyType === EnergyType.BASIC) {
          energies += 1;
        }
      });

      effect.damage = energies * 10;
    }

    return state;
  }
}
