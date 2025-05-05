import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { SessionGetters, Session } from './session.interface';

@Injectable({
  providedIn: 'root'
})
export class SessionService implements SessionGetters {

  private subject: BehaviorSubject<Session>;

  constructor() {
    const session = new Session();
    this.subject = new BehaviorSubject<Session>(session);
  }

  public get session(): Session {
    return this.subject.value;
  }

  public get(...selectors: ((session: Session) => any)[]): Observable<any> {
    if (selectors.length === 0) {
      return of(null);
    }
    if (selectors.length === 1) {
      return this.subject.asObservable().pipe(
        map(session => selectors[0](session)),
        distinctUntilChanged()
      );
    }
    return this.subject.asObservable().pipe(
      map(session => selectors.map(s => s(session))),
      distinctUntilChanged((a: any[], b: any[]) => {
        return a.every((value: any, index: number) => b[index] === value);
      }));
  }

  public set(change: Partial<Session>): void {
    const session = Object.assign({}, this.subject.value, change);
    this.subject.next(session);
  }

  public clear(): void {
    this.subject.next(new Session());
  }
}
