import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { Base64, Replay, GameState } from 'ptcg-server';

import { ApiService } from '../api.service';
import { GameService } from './game.service';
import { Response } from '../interfaces/response.interface';
import { ReplayDataResponse, ReplayListResponse, ReplayResponse } from '../interfaces/replay.interface';


@Injectable()
export class ReplayService {

  constructor(
    private api: ApiService,
    private gameService: GameService
  ) {}

  public getList(page: number = 0, query: string = '') {
    return query === ''
      ? this.api.get<ReplayListResponse>('/replays/list/' + page)
      : this.api.post<ReplayListResponse>('/replays/list/' + page, { query });
  }

  public getMatchReplayData(matchId: number) {
    return this.api.get<ReplayDataResponse>('/replays/match/' + matchId);
  }

  public getMatchReplay(matchId: number) {
    return this.getMatchReplayData(matchId)
      .pipe(map(response => {
        const replay = new Replay({ readStates: true, writeStates: false });
        const base64 = new Base64();
        replay.deserialize(base64.decode(response.replayData));

        const gameState: GameState = {
          gameId: 0,
          state: replay.getState(0),
          clientIds: []
        };

        return this.gameService.appendGameState(gameState, replay);
      }));
  }

  public getReplayData(replayId: number) {
    return this.api.get<ReplayDataResponse>('/replays/get/' + replayId);
  }

  public getReplay(replayId: number) {
    return this.getReplayData(replayId)
      .pipe(map(response => {
        const replay = new Replay({ readStates: true, writeStates: false });
        const base64 = new Base64();
        replay.deserialize(base64.decode(response.replayData));

        const gameState: GameState = {
          gameId: 0,
          state: replay.getState(0),
          clientIds: []
        };

        return this.gameService.appendGameState(gameState, replay);
      }));
  }

  public saveMatch(matchId: number, name: string) {
    return this.api.post<ReplayResponse>('/replays/save', { id: matchId, name });
  }

  public deleteReplay(replayId: number) {
    return this.api.post<Response>('/replays/delete', {
      id: replayId
    });
  }

  public rename(replayId: number, name: string) {
    return this.api.post<Response>('/replays/rename', {
      id: replayId,
      name
    });
  }

}
