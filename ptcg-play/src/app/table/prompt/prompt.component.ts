import { AnimationEvent } from '@angular/animations';
import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Prompt, GamePhase } from 'ptcg-server';

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

  constructor() { }

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

    if (!this.prompt || !prompt || this.prompt.id !== prompt.id || differentGame) {
      this.prompt = undefined;
      // setTimeout, because we would like the new prompt animate before displaying
      window.setTimeout(() => {
        this.prompt = prompt;
        this.toggle(prompt !== undefined);
      });
    }
  }

  /** Callback, invoked whenever an animation on the host completes. */
  public onAnimationEnd(event: AnimationEvent) {
    if (event.toState === 'exit' && this.prompt === undefined) {
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
