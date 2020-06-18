import { Injectable } from '@angular/core';
import { GameInfo, GameState, UserInfo } from 'ptcg-server';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

import { User } from './user.interface';

export class Session {
  authToken: string;
  loggedUser: User;
  clientId: number;
  games: GameInfo[] = [];
  users: UserInfo[] = [];
  gameStates: GameState[] = [];
}

@Injectable()
export class SessionService {

  private subject: BehaviorSubject<Session>;

  constructor() {
    const session = new Session();
    this.subject = new BehaviorSubject<Session>(session);
  }

  public get session(): Session {
    return this.subject.value;
  }

  public get<T>(selector: (session: Session) => T): Observable<T> {
    return this.subject.asObservable().pipe(
      map(session => selector(session)),
      distinctUntilChanged()
    );
  }

  public set(change: Partial<Session>): void {
    const session = Object.assign({}, this.subject.value, change);
    this.subject.next(session);
  }

  public clear(): void {
    this.subject.next(new Session());
  }
}
