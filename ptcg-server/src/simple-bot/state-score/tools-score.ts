import { State, PlayerType } from '../../game';
import { SimpleScore } from './score';

export class ToolsScore extends SimpleScore {

  public getScore(state: State, playerId: number): number {
    const player = this.getPlayer(state, playerId);
    const scores = this.options.scores.tools;
    
    let score = 0;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
      if (cardList.tool === undefined) {
        return;
      }
      const activeScore = cardList === player.active ? scores.active : 0;
      const hpScore = (card.hp - cardList.damage) * scores.hpLeft;
      if (activeScore + hpScore >= scores.minScore) {
        score += activeScore + hpScore;
      }
    });

    return score;
  }

}
