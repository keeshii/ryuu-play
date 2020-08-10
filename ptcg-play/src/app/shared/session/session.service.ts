import { Injectable } from '@angular/core';
import { GameInfo, GameState, ClientInfo, UserInfo, StateLog } from 'ptcg-server';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export interface LocalGameState extends GameState {
  localId: number;
  deleted: boolean;
  logs: StateLog[];
}

export class Session {
  authToken: string;
  loggedUser: UserInfo;
  clientId: number;
  games: GameInfo[] = [];
  clients: ClientInfo[] = [];
  lastGameId: number;
  gameStates: LocalGameState[] = [];
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
