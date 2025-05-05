import { Component, Input } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { ptcgInfoAnimations } from './info.animations';

@Component({
  selector: 'ptcg-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  animations: [ptcgInfoAnimations.ptcgAnimationState],
})
export class InfoComponent {

  public animationState = 'hidden';
  public isVisible = false;

  @Input() set visible(value: boolean) {
    value = coerceBooleanProperty(value);

    if (this.animationState !== 'visible' && value === true) {
      this.animationState = 'visible';
    }
    if (this.animationState !== 'hidden' && value === false) {
      this.animationState = 'hidden';
    }
  }

  constructor() { }

  public onAnimationEnd(event: AnimationEvent) {
    const { toState } = event;

    if (toState === 'hidden') {
      this.isVisible = false;
    }

    if (toState === 'visible') {
      this.isVisible = true;
    }
  }

}
