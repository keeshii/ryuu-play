import { State, PlayerType, TrainerType } from '@ptcg/common';
import { SimpleScore } from './score';

export class ToolsScore extends SimpleScore {

  public getScore(state: State, playerId: number): number {
    const player = this.getPlayer(state, playerId);
    const scores = this.options.scores.tools;
    
    let score = 0;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, card) => {
      if (!pokemonSlot.trainers.cards.some(t => t.trainerType === TrainerType.TOOL)) {
        return;
      }
      const activeScore = pokemonSlot === player.active ? scores.active : 0;
      const hpScore = (card.hp - pokemonSlot.damage) * scores.hpLeft;
      if (activeScore + hpScore >= scores.minScore) {
        score += activeScore + hpScore;
      }
    });

    return score;
  }

}
