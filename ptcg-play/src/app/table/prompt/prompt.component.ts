import { AnimationEvent } from '@angular/animations';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { GameState, Prompt } from 'ptcg-server';

import { ptcgPromptAnimations } from './prompt.animations';

@Component({
  selector: 'ptcg-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss'],
  animations: [ptcgPromptAnimations.promptContent],
})
export class PromptComponent implements OnInit, OnChanges {

  @Input() gameState: GameState;
  @Input() clientId: number;

  @Input() set active(value: boolean) {
    value = coerceBooleanProperty(value);
    this.toggle(value);
  }

  isPromptActive = false;

  /** State of the dialog animation. */
  animationState: 'void' | 'enter' | 'exit' = 'void';

  prompt: Prompt<any>;

  constructor() { }

  ngOnInit() { }

  ngOnChanges() {
    if (!this.gameState || !this.clientId) {
      return this.toggle(false);
    }

    const prompt = this.gameState.state.prompts.find(p => {
      return p.playerId === this.clientId && p.result === undefined;
    });

    if (!this.prompt || !prompt || this.prompt.id !== prompt.id) {
      this.prompt = prompt;
      return this.toggle(prompt !== undefined);
    }
  }

  /** Callback, invoked whenever an animation on the host completes. */
  onAnimationEnd(event: AnimationEvent) {
    if (event.toState === 'exit') {
      this.isPromptActive = false;
    }
  }

  /** Starts the dialog enter animation. */
  toggle(value: boolean): void {

    if (this.animationState !== 'enter' && value === true) {
      this.isPromptActive = true;
      this.animationState = 'enter';
    }
    if (this.animationState !== 'exit' && value === false) {
      this.animationState = 'exit';
    }
  }

}
