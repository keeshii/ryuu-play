import { Action } from './action';

export class InvitePlayerAction implements Action {

  readonly type: string = 'INVITE_PLAYER';

  constructor(
    public clientId: number,
    public name: string
  ) {}

}
