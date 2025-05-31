import {
  Resolver,
  CardTag,
  State,
  SuperType,
  TrainerCard,
  TrainerType,
} from '@ptcg/common';

export class DowsingMachine extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public tags = [CardTag.ACE_SPEC];

  public set: string = 'BW';

  public name: string = 'Dowsing Machine';

  public fullName: string = 'Dowsing Machine PLS';

  public text: string =
    'Discard 2 cards from your hand. (If you can\'t discard 2 cards, ' +
    'you can\'t play this card.) Put a Trainer card from your discard ' +
    'pile into your hand.';

  override *onPlay({require, player}: Resolver): Generator<State> {
    require.player.hand.contains({atLeast: 2});
    require.player.discard.contains({like: {superType: SuperType.TRAINER}});
    yield* player.discards(2).fromHand();
    yield* player.movesToHand(1, {superType: SuperType.TRAINER}).fromDiscard();
  }
}
