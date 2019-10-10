import { Action } from "./action";
import { Player } from "../state/player";

export class PassTurnAction implements Action {

  readonly type: string = 'PASS_TURN';

  constructor(public player: Player) {}

}
