import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { Base64, Replay, GameState } from 'ptcg-server';

import { ApiService } from '../api.service';
import { GameService } from './game.service';
import { ReplayResponse, ReplayListResponse } from '../interfaces/replay.interface';


@Injectable()
export class ReplayService {

  constructor(
    private api: ApiService,
    private gameService: GameService
  ) {}

  public getList(page: number = 0, query: string = '') {
    return this.api.get<ReplayListResponse>('/replays/list/' + page);
  }

  public getMatchReplay(matchId: number) {
    return this.api.get<ReplayResponse>('/replays/match/' + matchId)
      .pipe(map(response => {
        const replay = new Replay();
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

}
