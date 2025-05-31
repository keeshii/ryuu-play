import {
  State,
  TrainerCard,
  TrainerType,
  Resolver } from '@ptcg/common';

export class Cheren extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BW';

  public name: string = 'Cheren';

  public fullName: string = 'Cheren EPO';

  public text: string = 'Draw 3 cards.';

  override *onPlay({require, player}: Resolver): Generator<State> {
    require.player.deck.isNotEmpty();
    player.draws(3);
  }
}
