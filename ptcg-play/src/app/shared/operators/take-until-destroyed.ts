import { OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface TargetComponent extends OnDestroy {
  __takeUntilDestroy: Subject<void>;
}

export function takeUntilDestroyed<T>(component: OnDestroy) {

  return (source: Observable<T>): Observable<T> => {
    const target = component as TargetComponent;

    if (target.__takeUntilDestroy === undefined) {
      target.__takeUntilDestroy = new Subject();

      const originalDestroy = target.ngOnDestroy !== undefined
        ? target.ngOnDestroy
        : () => {};

      target.ngOnDestroy = function() {
        originalDestroy.apply(this, arguments);
        target.__takeUntilDestroy.next();
        target.__takeUntilDestroy.complete();
      };
    }

    return source.pipe(takeUntil(target.__takeUntilDestroy));
  };
}
