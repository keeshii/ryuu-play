import { Action } from './action';

export class AddPlayerAction implements Action {

  readonly type: string = 'ADD_PLAYER';

  constructor(
    public clientId: number,
    public name: string,
    public deck: string[]
  ) {}

}
