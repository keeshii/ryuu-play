import { Transaction, TransactionManager, EntityManager } from "typeorm";

import { Core } from "./core";
import { State, GamePhase, GameWinner } from "../store/state/state";
import { User, Match } from "../../storage";
import { RankingCalculator } from "./ranking-calculator";

export class MatchRecorder {

  private finished: boolean = false;
  private player1: User | undefined;
  private player2: User | undefined;
  private ranking: RankingCalculator;

  constructor(private core: Core) {
    this.ranking = new RankingCalculator();
  }

  public onStateChange(state: State) {
    if (this.finished) {
      return;
    }

    if (state.players.length >= 2) {
      this.updatePlayers(state);
    }

    if (state.phase === GamePhase.FINISHED) {
      this.finished = true;
      if (state.winner !== GameWinner.NONE) {
        this.saveMatch(state);
      }
    }
  }

  @Transaction()
  private async saveMatch(state: State, @TransactionManager() manager?: EntityManager) {
    if (!this.player1 || !this.player2 || manager === undefined) {
      return;
    }

    const match = new Match();
    match.player1 = this.player1;
    match.player2 = this.player2;
    match.winner = state.winner;
    match.created = Date.now();
    match.rankingStake = 0;

    try {
      await manager.save(match);

      // Update ranking
      const users = this.ranking.calculateMatch(match);
      if (users.length > 0) {
        await manager.save(users);
        this.core.emit(c => c.onUsersUpdate(users));
      }
    } catch (error) {
      return;
    }
  }

  private updatePlayers(state: State) {
    const player1Id = state.players[0].id;
    const player2Id = state.players[1].id;
    if (this.player1 === undefined) {
      this.player1 = this.findUser(player1Id);
    }
    if (this.player2 === undefined) {
      this.player2 = this.findUser(player2Id);
    }
  }

  private findUser(clientId: number): User | undefined {
    const client = this.core.clients.find(c => c.id === clientId);
    if (client !== undefined) {
      return client.user;
    }
  }

}
