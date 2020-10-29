import { Action } from "./action";

export enum PlayerType {
  ANY,
  TOP_PLAYER,
  BOTTOM_PLAYER
}

export enum SlotType {
  BOARD,
  ACTIVE,
  BENCH,
  HAND,
  DISCARD
}

export interface CardTarget {
  player: PlayerType;
  slot: SlotType;
  index: number;
}

export class PlayCardAction implements Action {

  readonly type: string = 'PLAY_CARD_ACTION';

  constructor(
    public id: number,
    public handIndex: number,
    public target: CardTarget
  ) {}

}
