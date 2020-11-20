import { Transaction, TransactionManager, EntityManager, LessThan } from "typeorm";

import { Core } from "./core";
import { State, GamePhase, GameWinner } from "../store/state/state";
import { User, Match } from "../../storage";
import { RankingCalculator } from "./ranking-calculator";
import { Replay } from "./replay";
import { ReplayPlayer } from "./replay.interface";
import { config } from "../../config";

export class MatchRecorder {

  private finished: boolean = false;
  private player1: User | undefined;
  private player2: User | undefined;
  private ranking: RankingCalculator;
  private replay: Replay;

  constructor(private core: Core) {
    this.ranking = new RankingCalculator();
    this.replay = new Replay({ indexEnabled: false });
  }

  public onStateChange(state: State) {
    if (this.finished) {
      return;
    }

    if (state.players.length >= 2) {
      this.updatePlayers(state);
    }

    if (state.phase !== GamePhase.WAITING_FOR_PLAYERS) {
      this.replay.appendState(state);
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
    match.ranking1 = this.player1.ranking;
    match.ranking2 = this.player2.ranking;
    match.rankingStake1 = 0;
    match.rankingStake2 = 0;

    this.replay.setCreated(match.created);
    this.replay.player1 = this.buildReplayPlayer(match.player1);
    this.replay.player2 = this.buildReplayPlayer(match.player2);
    this.replay.winner = match.winner;
    match.replayData = this.replay.serialize();

    try {
      // Update ranking
      const users = this.ranking.calculateMatch(match);

      // Update match's ranking
      if (users.length >= 2) {
        match.rankingStake1 = users[0].ranking - match.ranking1;
        match.ranking1 = users[0].ranking;
        match.rankingStake2 = users[1].ranking - match.ranking2;
        match.ranking2 = users[1].ranking;
      }

      await manager.save(match);

      if (users.length >= 2) {
        await manager.save(users);
        this.core.emit(c => c.onUsersUpdate(users));
      }

    } catch (error) {
      console.error(error);
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

  private buildReplayPlayer(player: User): ReplayPlayer {
    return { userId: player.id, name: player.name, ranking: player.ranking };
  }

  public async removeOldMatches(): Promise<void> {
    const keepMatchTime = config.core.keepMatchTime;
    const today = Date.now();
    const yesterday = today - keepMatchTime;
    await Match.delete({ created: LessThan(yesterday) });
    return;
  }

}
