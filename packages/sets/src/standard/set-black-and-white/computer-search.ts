import {
  CardTag,
  Resolver,
  TrainerCard,
  TrainerType,
} from '@ptcg/common';

export class ComputerSearch extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public tags = [CardTag.ACE_SPEC];

  public set: string = 'BW';

  public name: string = 'Computer Search';

  public fullName: string = 'Computer Search BCR';

  public text: string =
    'Discard 2 cards from your hand. (If you can\'t discard 2 cards, ' +
    'you can\'t play this card.) Search your deck for a card and put it into ' +
    'your hand. Shuffle your deck afterward.';

  override *onPlay({require, player}: Resolver) {
    require.player.hand.contains({atLeast: 2});
    require.player.deck.isNotEmpty();
    yield* player.discards(2).fromHand();
    yield* player.movesToHand(1).fromDeck();
  }
}
