import { Action } from "./action";

export class ReorderHandAction implements Action {

  readonly type: string = 'REORDER_HAND_ACTION';

  constructor(public id: number, public order: number[]) {}

}
