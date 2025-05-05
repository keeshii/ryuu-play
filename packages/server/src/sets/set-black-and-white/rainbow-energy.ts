import { CardType, EnergyType } from '@ptcg/common';
import { EnergyCard } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { CheckProvidedEnergyEffect } from '@ptcg/common';
import { AttachEnergyEffect } from '@ptcg/common';

export class RainbowEnergy extends EnergyCard {

  public provides: CardType[] = [ CardType.COLORLESS ];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BW';

  public name = 'Rainbow Energy';

  public fullName = 'Rainbow Energy SUM';

  public text =
    'This card provides C Energy. While in play, this card provides every ' +
    'type of Energy but provides only 1 Energy at a time. When you attach ' +
    'this card from your hand to 1 of your Pokemon, put 1 damage counter ' +
    'on that Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      effect.energyMap.push({ card: this, provides: [ CardType.ANY ] });
    }
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      effect.target.damage += 10;
    }
    return state;
  }

}
