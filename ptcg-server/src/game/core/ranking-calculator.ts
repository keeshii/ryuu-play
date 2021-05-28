import { User, Match } from "../../storage";
import { MoreThan, LessThan } from "typeorm";
import { GameWinner } from "../store/state/state";
import { Rank } from "../../backend";
import { config } from "../../config";

export class RankingCalculator {

  constructor() { }

  public calculateMatch(match: Match): User[] {
    const player1 = match.player1;
    const player2 = match.player2;
    const rank1 = player1.getRank();
    const rank2 = player2.getRank();

    const kValue = 50;
    const totalDiff = player2.ranking - player1.ranking;
    const diff = Math.max(-400, Math.min(400, totalDiff));
    const winExp = 1.0 / (1 + Math.pow(10.0, diff / 400.0));
    let outcome: number;
    let rankMultipier1: number = 1;
    let rankMultipier2: number = 1;

    switch (match.winner) {
      case GameWinner.PLAYER_1:
        outcome = 1;
        rankMultipier1 = this.getRankMultipier(rank1);
        break;
      case GameWinner.PLAYER_2:
        rankMultipier2 = this.getRankMultipier(rank2);
        outcome = 0;
        break;
      default:
      case GameWinner.DRAW:
        outcome = 0.5;
        break;
    }

    const stake = kValue * (outcome - winExp);
    const diff1 = this.getRankingDiff(rank1, rank2, Math.round(stake * rankMultipier1));
    const diff2 = this.getRankingDiff(rank1, rank2, Math.round(stake * rankMultipier2));

    player1.ranking = Math.max(0, player1.ranking + diff1);
    player2.ranking = Math.max(0, player2.ranking - diff2);

    const today = Date.now();
    player1.lastRankingChange = today;
    player2.lastRankingChange = today;

    return [ player1, player2 ];
  }

  private getRankingDiff(rank1: Rank, rank2: Rank, diff: number): number {
    const sign = diff >= 0;
    let value = Math.abs(diff);

    // Maximum ranking change for different ranks = 10
    if (rank1 !== rank2 && value > 10) {
      value = 10;
    }

    // Minimum ranking change = 5
    if (value < 5) {
      value = 5;
    }

    return sign ? value : -value;
  }

  private getRankMultipier(rank: Rank): number {
    switch (rank) {
      case Rank.JUNIOR:
        return 2.0;
      case Rank.SENIOR:
        return 1.0;
      case Rank.MASTER:
        return 0.8;
    }
    return 1;
  }

  public async decreaseRanking(): Promise<User[]> {
    const rankingDecraseRate = config.core.rankingDecraseRate;
    const oneDay = config.core.rankingDecraseTime;
    const today = Date.now();
    const yesterday = today - oneDay;
    const users = await User.find({ where: {
      lastRankingChange: LessThan(yesterday),
      ranking: MoreThan(0)
    }});

    // calculate new ranking in the server
    users.forEach(user => {
      user.lastRankingChange = today;
      user.ranking = Math.floor(user.ranking * rankingDecraseRate);
    });

    // execute update query in the database
    // sqlite doesn't support FLOOR, so we use ROUND(x - 0.5)
    await User.update({
      lastRankingChange: LessThan(yesterday),
      ranking: MoreThan(0)
    }, {
      lastRankingChange: today,
      ranking: () => `ROUND(${rankingDecraseRate} * ranking - 0.5)`
    });

    // is it wise to emit all users to all connected clients by websockets?
    return users;
  }

}
