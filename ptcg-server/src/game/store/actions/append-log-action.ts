import { Action } from './action';
import { GameLog } from '../../game-message';
import { StateLogParam } from '../state/state-log';

export class AppendLogAction implements Action {

  readonly type: string = 'APPEND_LOG_ACTION';

  constructor(public id: number, public message: GameLog, public params: StateLogParam) {}

}
