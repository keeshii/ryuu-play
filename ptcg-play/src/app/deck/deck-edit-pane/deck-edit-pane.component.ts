import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { SkyhookDndService, DropTarget } from '@angular-skyhook/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DeckEditPane } from './deck-edit-pane.interface';
import { DraggableType} from '../../shared/cards/card/card.component';
import { DeckCard } from '../deck-card/deck-card.interface';

@Component({
  selector: 'ptcg-deck-edit-pane',
  templateUrl: './deck-edit-pane.component.html',
  styleUrls: ['./deck-edit-pane.component.scss']
})
export class DeckEditPaneComponent implements OnInit, OnDestroy {

  @Input() type: DeckEditPane;
  @Output() cardDrop = new EventEmitter<DeckCard>();

  public dropTarget: DropTarget<{ card: DeckCard }, any>;
  public highlight$: Observable<boolean>;

  constructor(
    private dnd: SkyhookDndService
  ) {
    this.dropTarget = this.dnd.dropTarget(DraggableType, {
      canDrop: monitor => {
        const card = monitor.getItem().card;
        return card.pane !== this.type;
      },
      drop: monitor => {
        const card = monitor.getItem().card;
        this.cardDrop.next(card);
      }
    });

    const dropState = this.dropTarget.listen(monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }));

    this.highlight$ = dropState.pipe(map(state => state.canDrop && state.isOver));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.dropTarget.unsubscribe();
  }

}