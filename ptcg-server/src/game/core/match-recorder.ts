import { Transaction, TransactionManager, EntityManager } from 'typeorm';

import { Client } from '../client/client.interface';
import { Core } from './core';
import { State, GamePhase, GameWinner } from '../store/state/state';
import { User, Match } from '../../storage';
import { RankingCalculator } from './ranking-calculator';
import { Replay } from './replay';
import { ReplayPlayer } from './replay.interface';

export class MatchRecorder {

  private finished: boolean = false;
  private client1: Client | undefined;
  private client2: Client | undefined;
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
      this.updateClients(state);
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
    if (!this.client1 || !this.client2 || manager === undefined) {
      return;
    }

    const match = new Match();
    match.player1 = this.client1.user;
    match.player2 = this.client2.user;
    match.winner = state.winner;
    match.created = Date.now();
    match.ranking1 = match.player1.ranking;
    match.ranking2 = match.player2.ranking;
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
        for (const user of users) {
          const update = { ranking: user.ranking, lastRankingChange: user.lastRankingChange };
          await manager.update(User, user.id, update);
        }
        this.core.emit(c => c.onUsersUpdate(users));
      }

    } catch (error) {
      console.error(error);
      return;
    }
  }

  private updateClients(state: State) {
    const player1Id = state.players[0].id;
    const player2Id = state.players[1].id;
    if (this.client1 === undefined) {
      this.client1 = this.findClient(player1Id);
    }
    if (this.client2 === undefined) {
      this.client2 = this.findClient(player2Id);
    }
  }

  private findClient(clientId: number): Client | undefined {
    return this.core.clients.find(c => c.id === clientId);
  }

  private buildReplayPlayer(player: User): ReplayPlayer {
    return { userId: player.id, name: player.name, ranking: player.ranking };
  }

}
