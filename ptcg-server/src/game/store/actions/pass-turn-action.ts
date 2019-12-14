import { Action } from "./action";

export class PassTurnAction implements Action {

  readonly type: string = 'PASS_TURN';

  constructor(public clientId: number) {}

}
