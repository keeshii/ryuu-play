import {
  FilterType,
  Resolver,
  State,
  TrainerCard,
  TrainerType,
} from '@ptcg/common';

export class EnergyRetrieval extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW';

  public name: string = 'Energy Retrieval';

  public fullName: string = 'Energy Retrieval SUM';

  public text: string = 'Put 2 basic Energy cards from your discard pile into your hand.';

  override *onPlay({ require, player }: Resolver): Generator<State> {
    // const basicEnergy = { superType: SuperType.ENERGY, energyType: EnergyType.BASIC };
    require.player.discard.contains({like: FilterType.BASIC_ENERGY});
    yield* player.movesToHand(2, FilterType.BASIC_ENERGY).fromDiscard();
  }
}
