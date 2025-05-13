import { PokemonCard } from '@ptcg/common';
import { Stage, CardType } from '@ptcg/common';
import { StoreLike, State, EnergyCard } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { DiscardCardsEffect } from '@ptcg/common';

export class Raichu extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pikachu';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.METAL, value: -20 }];

  public retreat = [ ];

  public attacks = [
    {
      name: 'Circle Circuit',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: '20×',
      text: 'This attack does 20 damage times the number of your ' +
        'Benched Pokemon.'
    },
    {
      name: 'Thunderbolt',
      cost: [ CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS ],
      damage: '100',
      text: 'Discard all Energy attached to this Pokemon.'
    }
  ];

  public set: string = 'BW2';

  public name: string = 'Raichu';

  public fullName: string = 'Raichu XY';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const benched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      effect.damage = benched * 20;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const cards = player.active.cards.filter(c => c instanceof EnergyCard);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      return store.reduceEffect(state, discardEnergy);
    }

    return state;
  }

}
