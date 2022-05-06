import { Action } from './action';

export enum AbortGameReason {
  TIME_ELAPSED,
  ILLEGAL_MOVES,
  DISCONNECTED
}

export class AbortGameAction implements Action {

  readonly type: string = 'ABORT_GAME';

  constructor(
    public culpritId: number,
    public reason: AbortGameReason
  ) {}

}
