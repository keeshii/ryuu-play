import { Action } from './action';
import { StateLog } from '../state/state-log';

export class ChangeAvatarAction implements Action {

  readonly type: string = 'CHANGE_AVATAR';

  constructor(public id: number, public avatarName: string, public log?: StateLog) {}

}
