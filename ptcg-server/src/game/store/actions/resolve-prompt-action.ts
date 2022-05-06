import { Action } from './action';
import { StateLog } from '../state/state-log';

export class ResolvePromptAction implements Action {

  readonly type: string = 'RESOLVE_PROMPT';

  constructor(public id: number, public result: any, public log?: StateLog) {}

}
