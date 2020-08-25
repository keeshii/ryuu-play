import { User, Match } from "../../storage";
import { MoreThan, LessThan } from "typeorm";
import { GameWinner } from "../store/state/state";
import { Rank } from "../../backend";

export class RankingCalculator {

  constructor() { }

  public calculateMatch(match: Match): User[] {
    const player1 = match.player1;
    const player2 = match.player2;
    const rank1 = player1.getRank();
    const rank2 = player2.getRank();
    if (rank1 !== rank2) {
      return [];
    }

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
    player1.ranking = Math.max(0, player1.ranking + Math.round(stake * rankMultipier1));
    player2.ranking = Math.max(0, match.player2.ranking - Math.round(stake * rankMultipier2));

    const today = Date.now();
    player1.lastRankingChange = today;
    player2.lastRankingChange = today;

    return [ player1, player2 ];
  }

  private getRankMultipier(rank: Rank): number {
    switch (rank) {
      case Rank.JUNIOR:
        return 2.0;
      case Rank.SENIOR:
        return 1.5;
      case Rank.MASTER:
        return 1.1;
    }
    return 1;
  }

  public async decreaseRanking(): Promise<User[]> {
    const rankingDecraseRate = 0.95;
    const oneDay = 24 * 60 * 60 * 1000;
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
    await User.update({
      lastRankingChange: LessThan(yesterday),
      ranking: MoreThan(0)
    }, {
      lastRankingChange: today,
      ranking: () => `FLOOR(${rankingDecraseRate} * ranking)`
    });

    // is it wise to emit all users to all connected clients by websockets?
    return users;
  }

}
