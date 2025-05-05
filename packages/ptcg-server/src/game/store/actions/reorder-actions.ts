import { Action } from './action';

export class ReorderBenchAction implements Action {

  readonly type: string = 'REORDER_BENCH_ACTION';

  constructor(public id: number, public from: number, public to: number) {}

}


export class ReorderHandAction implements Action {

  readonly type: string = 'REORDER_HAND_ACTION';

  constructor(public id: number, public order: number[]) {}

}
