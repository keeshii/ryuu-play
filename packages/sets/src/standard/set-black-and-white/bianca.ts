import {
  State,
  TrainerCard,
  TrainerType,
  Resolver,
} from '@ptcg/common';

export class Bianca extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BW';

  public name: string = 'Bianca';

  public fullName: string = 'Bianca EPO';

  public text: string = 'Draw cards until you have 6 cards in your hand.';

  override *onPlay({require, player}: Resolver): Generator<State> {
    require.player.deck.isNotEmpty();
    require.player.hand.contains({atMost: 5});
    player.drawsUntil(6);
  }
}
