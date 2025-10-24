import { RankingCalculator } from './ranking-calculator';
import { User, Match } from '../../storage';
import { GameWinner } from '@ptcg/common';

describe('RankingCalculator', () => {
  let calculator: RankingCalculator;
  let match: Match;
  let player1: User;
  let player2: User;

  beforeEach(() => {
    calculator = new RankingCalculator();
    match = new Match();
    player1 = new User();
    player2 = new User();

    // Set up default player states
    player1.id = 1;
    player1.ranking = 1200;
    player2.id = 2;
    player2.ranking = 1200;

    match.player1 = player1;
    match.player2 = player2;
  });

  describe('calculateMatch', () => {
    it('should return empty array if same player', () => {
      match.player2 = player1; // Same player
      const result = calculator.calculateMatch(match);
      expect(result).toEqual([]);
    });

    it('should handle player 1 winning against equal opponent', () => {
      match.winner = GameWinner.PLAYER_1;
      calculator.calculateMatch(match);

      // For equal opponents, winner should gain and loser should lose approximately the same points
      expect(player1.ranking).toBeGreaterThan(1200);
      expect(player2.ranking).toBeLessThan(1200);
    });

    it('should handle player 2 winning against equal opponent', () => {
      match.winner = GameWinner.PLAYER_2;
      calculator.calculateMatch(match);

      expect(player2.ranking).toBeGreaterThan(1200);
      expect(player1.ranking).toBeLessThan(1200);
    });

    it('should handle draw between equal opponents', () => {
      match.winner = GameWinner.DRAW;
      calculator.calculateMatch(match);

      // In a draw between equal opponents, rankings should not change significantly
      expect(player1.ranking).toBeCloseTo(1205, 0);
      expect(player2.ranking).toBeCloseTo(1195, 0);
    });

    it('should handle higher ranked player winning against lower ranked', () => {
      player1.ranking = 1400;
      player2.ranking = 1000;
      match.winner = GameWinner.PLAYER_1;
      
      calculator.calculateMatch(match);

      // Higher ranked player should gain fewer points for winning
      const pointsGained = player1.ranking - 1400;
      expect(pointsGained).toBeGreaterThan(0);
      expect(pointsGained).toBeLessThan(25); // Small gain for beating much lower rated player
    });

    it('should handle lower ranked player winning against higher ranked', () => {
      player1.ranking = 1000;
      player2.ranking = 1400;
      match.winner = GameWinner.PLAYER_1;
      
      calculator.calculateMatch(match);

      // Lower ranked player should gain more points for winning against higher ranked
      const pointsGained = player1.ranking - 1000;
      expect(pointsGained).toBeGreaterThan(25); // Large gain for beating much higher rated player
    });

    it('should apply rank multiplier for lower ranks', () => {
      player1.ranking = 800; // Low rank
      player2.ranking = 800;
      match.winner = GameWinner.PLAYER_1;
      
      const normalGainPlayer = new User();
      normalGainPlayer.id = 3;
      normalGainPlayer.ranking = 1200;
      const normalMatch = new Match();
      normalMatch.player1 = normalGainPlayer;
      normalMatch.player2 = new User();
      normalMatch.player2.id = 4;
      normalMatch.player2.ranking = 1200;
      normalMatch.winner = GameWinner.PLAYER_1;

      calculator.calculateMatch(match);
      calculator.calculateMatch(normalMatch);

      // Lower ranked player should gain more points due to rank multiplier
      const lowRankGain = player1.ranking - 800;
      const normalRankGain = normalGainPlayer.ranking - 1200;
      expect(lowRankGain).toBeGreaterThan(normalRankGain);
    });

    it('should never let ranking go below 0', () => {
      player1.ranking = 1;
      player2.ranking = 1500;
      match.winner = GameWinner.PLAYER_2;
      
      calculator.calculateMatch(match);

      expect(player1.ranking).toBe(0);
    });

    it('should cap rating difference consideration at 400', () => {
      // Test with 800 point difference
      player1.ranking = 1000;
      player2.ranking = 1800;
      match.winner = GameWinner.PLAYER_1;
      
      const player3 = new User();
      player3.id = 3;
      player3.ranking = 1000;
      const player4 = new User();
      player4.id = 4;
      player4.ranking = 1400; // Only 400 point difference
      const match2 = new Match();
      match2.player1 = player3;
      match2.player2 = player4;
      match2.winner = GameWinner.PLAYER_1;

      calculator.calculateMatch(match);
      calculator.calculateMatch(match2);

      // Points gained should be the same since difference is capped at 400
      expect(player1.ranking - 1000).toBeCloseTo(player3.ranking - 1000, 0);
    });
  });
});