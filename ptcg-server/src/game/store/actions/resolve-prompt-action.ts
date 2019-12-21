import { Action } from "./action";

export class ResolvePromptAction implements Action {

  readonly type: string = 'RESOLVE_PROMPT';

  constructor(public id: number, public result: any) {}

}
