import { Action, Player, State, TrainerCard, UseTrainerInPlayAction, PlayerType } from '@ptcg/common';
import { SimpleTactic } from './simple-tactics';

export class UseTrainerInPlayTactic extends SimpleTactic {

  public useTactic(state: State, player: Player): Action | undefined {
    let bestScore = this.getStateScore(state, player.id);
    let useTrainerInPlayAction: UseTrainerInPlayAction | undefined;
    const passTurnScore = this.options.scores.tactics.passTurn;

    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, card, target) => {
      const trainers = [
        ...pokemonSlot.pokemons.cards,
        ...pokemonSlot.energies.cards,
        ...pokemonSlot.trainers.cards,
      ].filter(c => c instanceof TrainerCard) as TrainerCard[];

      for (const trainer of trainers) {
        if (trainer.useWhenInPlay) {
          const action = new UseTrainerInPlayAction(player.id, target, trainer.name);
          const score = this.evaluateAction(state, player.id, action, passTurnScore);

          if (score !== undefined && bestScore < score) {
            bestScore = score;
            useTrainerInPlayAction = action;
          }
        }
      }
    });

    return useTrainerInPlayAction;
  }

}
