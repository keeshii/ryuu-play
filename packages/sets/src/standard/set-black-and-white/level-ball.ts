import {
  Resolver,
  State,
  SuperType,
  TrainerCard,
  TrainerType,
} from '@ptcg/common';

export class LevelBall extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW';

  public name: string = 'Level Ball';

  public fullName: string = 'Level Ball NXD';

  public text: string =
    'Search your deck for a Pokémon with 90 HP or less, reveal it, ' +
    'and put it into your hand. Shuffle your deck afterward.';

  override *onPlay({ require, player, state }: Resolver): Generator<State> {
    require.player.deck.isNotEmpty();
    yield* player.movesToHand({like: { superType: SuperType.POKEMON, hp: (x: number) => x <= 90 } }).fromDeck();
  }
}
