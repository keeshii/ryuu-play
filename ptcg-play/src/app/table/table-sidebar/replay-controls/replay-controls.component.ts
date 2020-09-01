import { Component, OnInit, Input } from '@angular/core';
import { Replay, State } from 'ptcg-server';

import { LocalGameState } from '../../../shared/session/session.interface';
import { SessionService } from '../../../shared/session/session.service';

@Component({
  selector: 'ptcg-replay-controls',
  templateUrl: './replay-controls.component.html',
  styleUrls: ['./replay-controls.component.scss']
})
export class ReplayControlsComponent implements OnInit {

  @Input() set gameState(gameState: LocalGameState) {
    this.gameStateValue = gameState;

    if (this.replay !== gameState.replay) {
      this.initReplayControls(gameState.replay);
    }
  }

  public currentState = 0;
  private gameStateValue: LocalGameState;
  private replay: Replay;

  constructor(private sessionService: SessionService) { }

  ngOnInit(): void {
  }

  public showInfo(): void {
  }

  public showPreviousState(): void {
    this.currentState -= 1;
    const newState = this.replay.getState(this.currentState);
    this.setState(newState);
  }

  public showNextState(): void {
    this.currentState += 1;
    const newState = this.replay.getState(this.currentState);
    this.setState(newState);
  }

  private setState(state: State) {
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.replay === this.replay);
    if (index !== -1) {
      const gameStates = this.sessionService.session.gameStates.slice();
      const logs = state.logs;
      gameStates[index] = { ...gameStates[index], state, logs };
      this.sessionService.set({ gameStates });
    }
  }

  private initReplayControls(replay: Replay) {
    this.replay = replay;
    this.currentState = 0;
  }

}
