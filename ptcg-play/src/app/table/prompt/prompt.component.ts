import { AnimationEvent } from '@angular/animations';
import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Prompt, GamePhase } from 'ptcg-server';

import { GameService } from '../../api/services/game.service';
import { GameOverPrompt } from './prompt-game-over/game-over.prompt';
import { LocalGameState } from '../../shared/session/session.interface';
import { ptcgPromptAnimations } from './prompt.animations';

@Component({
  selector: 'ptcg-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss'],
  animations: [ptcgPromptAnimations.promptContent],
  encapsulation: ViewEncapsulation.None
})
export class PromptComponent implements OnChanges {

  @Input() gameState: LocalGameState;
  @Input() clientId: number;

  public isPromptVisible = false;

  /** State of the dialog animation. */
  public animationState: 'void' | 'enter' | 'exit' = 'void';

  public prompt: Prompt<any>;

  public minimized = false;

  constructor(private gameService: GameService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.gameState || !this.clientId) {
      return this.toggle(false);
    }

    let differentGame = false;
    if (changes.gameState) {
      const previousState: LocalGameState = changes.gameState.previousValue;
      differentGame = !previousState || previousState.localId !== this.gameState.localId;
    }

    let prompt = this.gameState.state.prompts.find(p => {
      return p.playerId === this.clientId && p.result === undefined;
    });

    prompt = prompt || this.checkGameOver(this.gameState);
    const promptId = prompt ? prompt.id : -1;
    const currentId = this.prompt ? this.prompt.id : -1;

    if (currentId !== promptId || differentGame) {
      this.prompt = undefined;
      // setTimeout, because we would like the new prompt animate before displaying
      window.setTimeout(() => {
        this.prompt = prompt;
        this.minimized = false;
        this.maximize();
        this.toggle(prompt !== undefined);
      });
    } else if (this.minimized !== this.gameState.promptMinimized) {
      this.minimized = this.gameState.promptMinimized;
      this.toggle(prompt !== undefined && !this.minimized);
    }
  }

  public maximize() {
    if (this.gameState.promptMinimized) {
      this.gameService.setPromptMinimized(this.gameState.localId, false);
    }
  }

  /** Callback, invoked whenever an animation on the host completes. */
  public onAnimationEnd(event: AnimationEvent) {
    const toExitState = event.toState === 'exit' || event.toState === 'void';
    const isNotVisible = this.prompt === undefined || this.minimized;
    if (toExitState && isNotVisible) {
      this.isPromptVisible = false;
    }
  }

  /** Starts the dialog enter animation. */
  private toggle(value: boolean): void {
    if (this.animationState !== 'enter' && value === true) {
      this.isPromptVisible = true;
      this.animationState = 'enter';
    } else if (this.animationState !== 'exit' && value === false) {
      this.animationState = 'exit';
    }
  }

  private checkGameOver(gameState: LocalGameState): GameOverPrompt | undefined {
    if (gameState.state.phase === GamePhase.FINISHED && gameState.gameOver === false) {
      return new GameOverPrompt(this.clientId, gameState.state.winner);
    }
  }

}
