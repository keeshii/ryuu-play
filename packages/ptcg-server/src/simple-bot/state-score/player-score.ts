import { State, StateUtils, GameWinner } from '../../game';
import { SimpleScore } from './score';

export class PlayerScore extends SimpleScore {

  public getScore(state: State, playerId: number): number {
    const player = this.getPlayer(state, playerId);
    const opponent = StateUtils.getOpponent(state, player);
    const scores = this.options.scores.player;

    let score = 0;

    // 10000 points if we have won the game
    const isPlayer1 = state.players[0] === player;
    if (state.winner === GameWinner.PLAYER_1) {
      score += isPlayer1 ? scores.winner : -scores.winner;
    }
    const isPlayer2 = state.players[1] === player;
    if (state.winner === GameWinner.PLAYER_2) {
      score += isPlayer2 ? scores.winner : -scores.winner;
    }

    // 1000 points for each prize card less than opponent
    const playerPrizes = player.prizes.filter(p => p.cards.length !== 0);
    const opponentPrizes = opponent.prizes.filter(p => p.cards.length !== 0);
    score += scores.prize * (opponentPrizes.length - playerPrizes.length);

    // 1 point for each card in the deck
    score += scores.deck * player.deck.cards.length;

    // -10 points, if our deck has less than 10 cards
    if (player.deck.cards.length < 10) {
      score += scores.deckLessThan10 * (10 - player.deck.cards.length);
    }

    return score;
  }

}
