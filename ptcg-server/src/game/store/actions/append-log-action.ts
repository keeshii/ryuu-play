import { Action } from "./action";

export class AppendLogAction implements Action {

  readonly type: string = 'APPEND_LOG_ACTION';

  constructor(public id: number, public message: string) {}

}
