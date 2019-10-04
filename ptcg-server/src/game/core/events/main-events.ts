import { Event } from './event';
import { EventHandler } from './event-handler';
import { User } from '../../../storage';

export class MainJoinEvent implements Event {
  readonly type: string = 'MAIN_JOIN';
  constructor(public user: User) { }
}

export class MainDisconnectEvent implements Event {
  readonly type: string = 'MAIN_DISCONNECT';
  constructor(public user: User) { }
}

export class MainCreateGameEvent implements Event {
  readonly type: string = 'MAIN_CREATE_GAME';
  constructor(public gameId: number) { }
}

export class MainDropGameEvent implements Event {
  readonly type: string = 'MAIN_DROP_GAME';
  constructor(public gameId: number) { }
}

export type MainEvent
  = MainJoinEvent
  | MainDisconnectEvent
  | MainCreateGameEvent
  | MainDropGameEvent;

export type MainHandler = EventHandler<MainEvent>;