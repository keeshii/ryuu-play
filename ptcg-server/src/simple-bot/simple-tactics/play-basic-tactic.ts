import { Action, Player, State, PokemonCard, Stage, PlayCardAction } from '../../game';
import { SimpleTactic } from './simple-tactics';

export class PlayBasicTactic extends SimpleTactic {

  public useTactic(state: State, player: Player): Action | undefined {
    const basicPokemon = player.hand.cards
      .find(c => c instanceof PokemonCard && c.stage === Stage.BASIC);

    const emptyBenchSlot = player.bench
      .find(b => b.cards.length === 0);

    if (basicPokemon && emptyBenchSlot) {
      return new PlayCardAction(
        player.id,
        player.hand.cards.indexOf(basicPokemon),
        this.getCardTarget(player, state, emptyBenchSlot)
      );
    }
  }

}
