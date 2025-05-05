import { Directive, Input, HostBinding, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Directive({
  selector: '[ptcgCardPlaceholder]'
})
export class CardPlaceholderDirective implements OnDestroy {

  @HostBinding('class.placeholder') placeholder = false;
  private subscription: Subscription;

  @Input() set ptcgCardPlaceholder(isDragging$: Observable<boolean>) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = isDragging$.subscribe({
      next: value => { this.placeholder = value; }
    });
  }

  constructor() { }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
