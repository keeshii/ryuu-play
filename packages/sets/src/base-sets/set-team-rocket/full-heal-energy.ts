import {
  AttachEnergyEffect,
  CardType,
  Effect,
  EnergyCard,
  EnergyType,
  SpecialCondition,
  State,
  StoreLike,
} from '@ptcg/common';

export class FullHealEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'TR';

  public name: string = 'Full Heal Energy';

  public fullName: string = 'Full Heal Energy TR';

  public text: string = 'If you play this card from hand, the Pokémon you attach ' +
    'it to is no longer Asleep, Confused, Paralyzed, or Poisoned. ' +
    'Full Heal Energy provides C energy. (Doesn\'t count as a basic Energy card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const conditions = [
        SpecialCondition.ASLEEP,
        SpecialCondition.CONFUSED,
        SpecialCondition.PARALYZED,
        SpecialCondition.POISONED
      ];
      conditions.forEach(condition => {
        effect.target.removeSpecialCondition(condition);
      });
    }
    return state;
  }
}
