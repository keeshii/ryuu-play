import { Action } from "./action";

export class ChangeAvatarAction implements Action {

  readonly type: string = 'CHANGE_AVATAR';

  constructor(public id: number, public avatarName: string) {}

}
