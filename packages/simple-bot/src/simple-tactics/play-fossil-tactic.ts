import { Action, Player, State, Stage, PlayCardAction, TrainerCard, TrainerType, PokemonCard, SuperType } from '@ptcg/common';
import { SimpleTactic } from './simple-tactics';

export class PlayFossilTactic extends SimpleTactic {

  public useTactic(state: State, player: Player): Action | undefined {
    const trainers = player.hand.cards
      .filter(c => c.superType === SuperType.TRAINER
        && (c as TrainerCard).trainerType === TrainerType.ITEM
        && (c as PokemonCard).stage === Stage.BASIC
        && (c as PokemonCard).hp > 0
      );

    const emptyBenchSlot = player.bench.find(b => b.pokemons.cards.length === 0);

    if (trainers.length === 0 || !emptyBenchSlot) {
      return;
    }

    const target = this.getCardTarget(player, state, emptyBenchSlot);

    // Decrease from score the value of the item card on hand,
    // so the AI is not afraid to play a wimpy Pokemon on Bench
    const itemScore = this.options.scores.hand.itemScore;
    let bestScore = this.getStateScore(state, player.id) - itemScore;
    let playCardAction: PlayCardAction | undefined;

    trainers.forEach(card => {
      const index = player.hand.cards.indexOf(card);
      const action = new PlayCardAction(player.id, index, target);
      const score = this.evaluateAction(state, player.id, action);

      if (score !== undefined && bestScore < score) {
        bestScore = score;
        playCardAction = action;
      }
    });

    return playCardAction;
  }

}
