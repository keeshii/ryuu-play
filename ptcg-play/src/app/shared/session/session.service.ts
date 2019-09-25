import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { User } from './user.interface';

export class Session {
  authToken: string;
  profile: User;
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

  public get(): Observable<Session> {
    return this.subject.asObservable();
  }

  public set(change: Partial<Session>): void {
    const session = Object.assign({}, this.subject.value, change);
    this.subject.next(session);
  }

  public clear(): void {
    this.subject.next(new Session());
  }
}
