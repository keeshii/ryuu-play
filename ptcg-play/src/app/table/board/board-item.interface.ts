import { DragSource } from '@angular-skyhook/core';
import { Player } from 'ptcg-server';

import { HandItem } from '../hand/hand-item.interface';

export const BoardCardType = 'BOARD_SLOT';

export enum PlayerType {
  ANY,
  TOP_PLAYER,
  BOTTOM_PLAYER
}

export enum SlotType {
  BOARD,
  ACTIVE,
  BENCH
}

export interface BoardCardItem {
  player: PlayerType;
  slot: SlotType;
  index: number;
  scanUrl: string;
  source?: DragSource<BoardCardItem>;
}

export type BoardItem = HandItem | BoardCardItem;
