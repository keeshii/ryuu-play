import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { DraggedItem } from '@angular-skyhook/sortable';
import { DropTarget, SkyhookDndService } from '@angular-skyhook/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GameState, Player, SuperType, SlotType, PlayerType, CardTarget, Card } from 'ptcg-server';
import { HandItem, HandCardType } from '../hand/hand-item.interface';
import { BoardCardItem, BoardCardType } from './board-item.interface';
import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { GameService } from '../../api/services/game.service';

const BENCH_SIZE = 5;

type DropTargetType = DropTarget<DraggedItem<HandItem> | BoardCardItem, any>;

@Component({
  selector: 'ptcg-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy, OnChanges {

  @Input() clientId: number;
  @Input() gameState: GameState;
  @Input() topPlayer: Player;
  @Input() bottomPlayer: Player;

  public isTopOwner = false;
  public isBottomOwner = false;

  public topBench = new Array(BENCH_SIZE);
  public bottomActive: BoardCardItem;
  public bottomBench: BoardCardItem[];

  public boardTarget: DropTargetType;
  public boardHighlight$: Observable<boolean>;
  public bottomActiveTarget: DropTargetType;
  public bottomActiveHighlight$: Observable<boolean>;
  public bottomBenchTarget: DropTargetType[];
  public bottomBenchHighlight$: Observable<boolean>[];

  constructor(
    private cardsBaseService: CardsBaseService,
    private dnd: SkyhookDndService,
    private gameService: GameService
  ) {
    // Bottom Player
    this.bottomActive = this.createBoardCardItem(PlayerType.BOTTOM_PLAYER, SlotType.ACTIVE);
    [this.bottomActiveTarget, this.bottomActiveHighlight$] = this.initDropTarget(PlayerType.BOTTOM_PLAYER, SlotType.ACTIVE);

    this.bottomBench = [];
    this.bottomBenchTarget = [];
    this.bottomBenchHighlight$ = [];
    for (let i = 0; i < BENCH_SIZE; i++) {
      const item = this.createBoardCardItem(PlayerType.BOTTOM_PLAYER, SlotType.BENCH, i);
      this.bottomBench.push(item);
      let target: DropTargetType;
      let highlight$: Observable<boolean>;
      [target, highlight$] = this.initDropTarget(PlayerType.BOTTOM_PLAYER, SlotType.BENCH, i);
      this.bottomBenchTarget.push(target);
      this.bottomBenchHighlight$.push(highlight$);
    }

    // Dropping
    [this.boardTarget, this.boardHighlight$] = this.initDropTarget(PlayerType.ANY, SlotType.BOARD);
  }

  private initDropTarget(
    player: PlayerType,
    slot: SlotType,
    index: number = 0
  ): [DropTargetType, Observable<boolean>]  {

    const target = { player, slot, index };
    let dropTarget: DropTargetType;
    let highlight$: Observable<boolean>;

    dropTarget = this.dnd.dropTarget([HandCardType, BoardCardType], {
      canDrop: monitor => {
        const item = monitor.getItem();
        if (!this.gameState) {
          return false;
        }
        const isFromHand = (item as DraggedItem<HandItem>).type === HandCardType;
        if (slot === SlotType.BOARD) {
          return isFromHand;
        }
        const boardCard = item as BoardCardItem;
        // Do not drop to the same target
        if (player === boardCard.player
          && slot === boardCard.slot
          && index === boardCard.index) {
          return false;
        }
        return true;
      },
      drop: monitor => {
        const hasDroppedOnChild = monitor.didDrop();
        // Card already dropped on the card slot
        if (hasDroppedOnChild) {
          return;
        }
        const item = monitor.getItem();
        if ((item as DraggedItem<HandItem>).type === HandCardType) {
          const handItem = (item as DraggedItem<HandItem>).data;
          this.handlePlayFromHand(handItem, target);
          return;
        }
        this.handleMoveBoardCard(item as BoardCardItem, target);
      }
    });

    const dropState = dropTarget.listen(monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver({ shallow: true }),
    }));

    highlight$ = dropState.pipe(map(state => state.canDrop && state.isOver));

    return [ dropTarget, highlight$ ];
  }

  private handlePlayFromHand(item: HandItem, target: CardTarget): void {
    this.gameService.playCardAction(this.gameState.gameId, item.index, target);
  }

  private handleMoveBoardCard(item: BoardCardItem, target: CardTarget): void {
    const gameId = this.gameState.gameId;

    // ReorderBenchAction
    if (item.player === PlayerType.BOTTOM_PLAYER
      && item.slot === SlotType.BENCH
      && target.player === PlayerType.BOTTOM_PLAYER
      && target.slot === SlotType.BENCH
      && target.index !== item.index) {
      this.gameService.reorderBenchAction(gameId, item.index, target.index);
      return;
    }

    // RetreatAction (Active -> Bench)
    if (item.player === PlayerType.BOTTOM_PLAYER
      && item.slot === SlotType.ACTIVE
      && target.player === PlayerType.BOTTOM_PLAYER
      && target.slot === SlotType.BENCH) {
      this.gameService.retreatAction(gameId, target.index);
      return;
    }

    // RetreatAction (Bench -> Active)
    if (item.player === PlayerType.BOTTOM_PLAYER
      && item.slot === SlotType.BENCH
      && target.player === PlayerType.BOTTOM_PLAYER
      && target.slot === SlotType.ACTIVE) {
      this.gameService.retreatAction(gameId, item.index);
      return;
    }
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.bottomActive.source.unsubscribe();
    this.bottomActiveTarget.unsubscribe();

    for (let i = 0; i < BENCH_SIZE; i++) {
      this.bottomBench[i].source.unsubscribe();
      this.bottomBenchTarget[i].unsubscribe();
    }
  }

  private getScanUrl(item: BoardCardItem): string {
    const player = item.player === PlayerType.TOP_PLAYER
      ? this.topPlayer
      : this.bottomPlayer;

    if (!player) {
      return undefined;
    }
    const cardList = item.slot === SlotType.ACTIVE
      ? player.active
      : player.bench[item.index];

    let scanUrl;
    for (const card of cardList.cards) {
      if (card.superType === SuperType.POKEMON) {
        scanUrl = this.cardsBaseService.getScanUrl(card.fullName);
      }
    }
    return scanUrl;
  }

  private createBoardCardItem(player: PlayerType, slot: SlotType, index: number = 0): BoardCardItem {
    const boardCardItem: BoardCardItem = { player, slot, index, scanUrl: undefined };

    const source = this.dnd.dragSource<BoardCardItem>(BoardCardType, {
      canDrag: () => {
        return this.getScanUrl(boardCardItem) !== undefined;
      },
      beginDrag: () => {
        return { ...boardCardItem, scanUrl: this.getScanUrl(boardCardItem) };
      }
    });

    boardCardItem.source = source;

    return boardCardItem;
  }

  public onCardClick(card: Card) {
    this.cardsBaseService.showCardInfo(card);
  }

  ngOnChanges() { }

}
