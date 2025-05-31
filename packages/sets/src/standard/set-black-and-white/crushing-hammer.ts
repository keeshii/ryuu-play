import {
  Resolver,
  PlayerType,
  SuperType,
  TrainerCard,
  TrainerType,
} from '@ptcg/common';

export class CrushingHammer extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW';

  public name: string = 'Crushing Hammer';

  public fullName: string = 'Crushing Hammer EPO';

  public text: string = 'Flip a coin. If heads, discard an Energy attached to 1 of your opponent\'s Pokémon.';

  override *onPlay({ require, player }: Resolver) {
    require.opponent.hasPokemon({with: {superType: SuperType.ENERGY}});
    const isHeads = yield* player.flipsCoin();
    if (isHeads) {
      yield* player.choosesPokemon({
        playerType: PlayerType.TOP_PLAYER,
        with: {superType: SuperType.ENERGY},
      }).andDiscards({
        like: { superType: SuperType.ENERGY },
      });
    }
  }
}
