import {
  AttachEnergyEffect,
  CardType,
  Effect,
  EnergyCard,
  EnergyType,
  HealEffect,
  State,
  StoreLike,
} from '@ptcg/common';

export class PotionEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'TR';

  public name: string = 'Potion Energy';

  public fullName: string = 'Potion Energy TR';

  public text: string = 'If you play this card from your hand, remove 1 damage '
    + 'counter from the Pokemon you attach it to, if it has any. '
    + 'Potion Energy provides C energy. (Doesn\'t count as a basic Energy card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const player = effect.player;
      const healEffect = new HealEffect(player, effect.target, 10);
      return store.reduceEffect(state, healEffect);
    }
    return state;
  }
}
