import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSliderChange } from '@angular/material/slider';
import { Replay } from 'ptcg-server';
import { Subject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime } from 'rxjs/operators';

import { LocalGameState } from '../../../shared/session/session.interface';
import { SelectPopupOption } from '../../../shared/alert/select-popup/select-popup.component';
import { SessionService } from '../../../shared/session/session.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-replay-controls',
  templateUrl: './replay-controls.component.html',
  styleUrls: ['./replay-controls.component.scss']
})
export class ReplayControlsComponent implements OnInit, OnDestroy {

  @Input() set gameState(gameState: LocalGameState) {
    this.gameStateValue = gameState;

    if (this.replay !== gameState.replay) {
      this.initReplayControls(gameState.replay, gameState.replayPosition);
    }
  }

  public readonly statesPerSecondOptions: SelectPopupOption<number>[] = [
    { value: 4000, viewValue: '0.25' },
    { value: 2000, viewValue: '0.5' },
    { value: 1000, viewValue: '1' },
    { value: 500, viewValue: '2' }
  ];

  public position = 1;
  public stateCount = 0;
  public turnCount = 0;
  public statesPerSecond = 1000;
  public playInterval: number | undefined;
  private sliderChange$ = new Subject<number>();
  private gameStateValue: LocalGameState;
  private replay: Replay;

  constructor(private sessionService: SessionService) { }

  ngOnInit(): void {
    this.sliderChange$
      .pipe(
        debounceTime(300),
        untilDestroyed(this)
      )
      .subscribe({
        next: value => this.setState(value)
      });
  }

  ngOnDestroy(): void {
    if (this.playInterval) {
      this.clearPlayInterval();
    }
  }

  public showInfo(): void {
  }

  public togglePlay(): void {
    if (this.playInterval === undefined) {
      this.setPlayInterval();
    } else {
      this.clearPlayInterval();
    }
  }

  private setPlayInterval(): void {
    this.clearPlayInterval();
    this.playInterval = window.setInterval(() => {
      const newPosition = this.position + 1;
      this.setState(newPosition);
      // end reached, no next tick
      if (newPosition + 1 > this.stateCount) {
        this.clearPlayInterval();
      }
    }, this.statesPerSecond);
  }

  private clearPlayInterval(): void {
    if (this.playInterval !== undefined) {
      window.clearInterval(this.playInterval);
      this.playInterval = undefined;
    }
  }

  public showPreviousState(): void {
    this.setState(this.position - 1);
  }

  public showNextState(): void {
    this.setState(this.position + 1);
  }

  public showNextTurn(): void {
    const turnCount = this.replay.getTurnCount();
    const position = this.position;
    for (let i = 0; i < turnCount; i++) {
      const newPosition = this.replay.getTurnPosition(i) + 1;
      if (position < newPosition) {
        this.setState(newPosition);
        return;
      }
    }
    const lastState = this.replay.getStateCount();
    if (position < lastState) {
      this.setState(lastState);
    }
  }

  public showPreviousTurn(): void {
    const turnCount = this.replay.getTurnCount();
    const position = this.position;
    for (let i = turnCount - 1; i >= 0; i--) {
      const newPosition = this.replay.getTurnPosition(i) + 1;
      if (position > newPosition) {
        this.setState(newPosition);
        return;
      }
    }
    if (position > 1) {
      this.setState(1);
    }
  }

  public onStatesPerSecondChange(change: MatSelectChange) {
    // update current playing speed
    if (this.playInterval) {
      this.setPlayInterval();
    }
  }

  public onSliderChange(change: MatSliderChange): void {
    this.sliderChange$.next(change.value);
  }

  private setState(position: number) {
    if (position < 1 || position > this.stateCount) {
      return;
    }
    const games = this.sessionService.session.gameStates;
    const index = games.findIndex(g => g.replay === this.replay);
    if (index !== -1) {
      const state = this.replay.getState(position - 1);
      const replayPosition = position;
      this.position = position;
      const gameStates = this.sessionService.session.gameStates.slice();
      const logs = state.logs;
      gameStates[index] = { ...gameStates[index], state, logs, replayPosition };
      this.sessionService.set({ gameStates });
    }
  }

  private initReplayControls(replay: Replay, position: number) {
    this.replay = replay;
    this.position = position;
    this.stateCount = replay.getStateCount();
    this.turnCount = replay.getTurnCount();
  }

}
