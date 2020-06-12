import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DraggedItem } from '@angular-skyhook/sortable';
import { DropTarget, SkyhookDndService } from '@angular-skyhook/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GameState, Player } from 'ptcg-server';
import { HandItem, HandCardType } from '../hand/hand-item.interface';
import { takeUntilDestroyed } from 'src/app/shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

  @Output() highlighted = new EventEmitter<boolean>();
  @Input() clientId: number;
  @Input() gameState: GameState;
  @Input() topPlayer: Player;
  @Input() bottomPlayer: Player;

  public boardTarget: DropTarget<DraggedItem<HandItem>, any>;
  public boardHighlight$: Observable<boolean>;

  constructor(private dnd: SkyhookDndService) {
    [this.boardTarget, this.boardHighlight$] = this.initDropTarget();
  }

  private initDropTarget(): [DropTarget<DraggedItem<HandItem>, any>, Observable<boolean>]  {
    let dropTarget: DropTarget<DraggedItem<HandItem>, any>;
    let highlight$: Observable<boolean>;

    dropTarget = this.dnd.dropTarget(HandCardType, {
      canDrop: monitor => {
        // const card = monitor.getItem().data;
        return true;
      },
      drop: monitor => {
        // Card already dropped on the list
        /*if (this.hasDropped) {
          return;
        }
        const card = monitor.getItem().data;
        this.ngZone.run(() => pane === DeckEditPane.LIBRARY
          ? this.removeCardFromDeck(card)
          : this.addCardToDeck(card));*/
      }
    });

    const dropState = dropTarget.listen(monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }));

    highlight$ = dropState.pipe(map(state => state.canDrop && state.isOver));

    return [ dropTarget, highlight$ ];
  }

  ngOnInit() {
    this.boardHighlight$
      .pipe(takeUntilDestroyed(this))
      .subscribe({
      next: isHighlighted => this.highlighted.emit(isHighlighted)
    });
  }

  ngOnDestroy() { }

}
