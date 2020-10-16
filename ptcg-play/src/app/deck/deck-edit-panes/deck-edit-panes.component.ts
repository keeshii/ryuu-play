import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { SkyhookDndService, DropTarget } from '@angular-skyhook/core';
import { DraggedItem, SortableSpec } from '@angular-skyhook/sortable';
import { Observable } from 'rxjs';
import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { map } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { CardsBaseService } from 'src/app/shared/cards/cards-base.service';
import { DeckEditPane } from './deck-edit-pane.interface';
import { DeckEditToolbarFilter } from '../deck-edit-toolbar/deck-edit-toolbar-filter.interface';
import { DeckItem, LibraryItem } from '../deck-card/deck-card.interface';
import { DeckCardType } from '../deck-card/deck-card.component';
import { DeckEditVirtualScrollStrategy } from './deck-edit-virtual-scroll-strategy';

const DECK_CARD_ITEM_WIDTH = 148;
const DECK_CARD_ITEM_HEIGHT = 173;

@Component({
  selector: 'ptcg-deck-edit-panes',
  templateUrl: './deck-edit-panes.component.html',
  styleUrls: ['./deck-edit-panes.component.scss'],
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useValue: new DeckEditVirtualScrollStrategy(DECK_CARD_ITEM_WIDTH, DECK_CARD_ITEM_HEIGHT)
  }]
})
export class DeckEditPanesComponent implements OnInit, OnDestroy {

  @Input() toolbarFilter: DeckEditToolbarFilter;
  @Output() deckItemsChange = new EventEmitter<DeckItem[]>();

  @Input() set deckItems(value: DeckItem[]) {
    this.list = value;
    this.tempList = value;
  }

  public deckTarget: DropTarget<DraggedItem<DeckItem>, any>;
  public deckHighlight$: Observable<boolean>;
  public libraryTarget: DropTarget<DraggedItem<DeckItem>, any>;
  public libraryHighlight$: Observable<boolean>;
  public deckSpec: SortableSpec<DeckItem>;
  public cards: LibraryItem[] = [];
  public hasDropped: boolean;

  list: DeckItem[] = [];
  tempList: DeckItem[] = [];

  constructor(
    private alertService: AlertService,
    private cardsBaseService: CardsBaseService,
    private ngZone: NgZone,
    private dnd: SkyhookDndService
  ) {
    [this.deckTarget, this.deckHighlight$] = this.initDropTarget(DeckEditPane.DECK);
    [this.libraryTarget, this.libraryHighlight$] = this.initDropTarget(DeckEditPane.LIBRARY);

    this.deckSpec = {
      type: DeckCardType,
      trackBy: item => item.card.fullName + item.pane,
      hover: item => {
        this.tempList = this.moveDeckCards(item);
      },
      drop: item => {
        this.hasDropped = true;
        this.tempList = this.list = this.moveDeckCards(item);
        if (!item.isInternal) {
          const newItem = this.list.find(i => i.card.fullName === item.data.card.fullName);
          newItem.count += 1;
        }
        this.deckItemsChange.next(this.list);
      },
      endDrag: () => {
        this.hasDropped = false;
        this.tempList = this.list;
      },
      isDragging: (ground: DeckItem, inFlight: DraggedItem<DeckItem>) => {
        return ground.card.fullName === inFlight.data.card.fullName;
      }
    };
  }

  private loadLibraryCards(): LibraryItem[] {
    return this.cardsBaseService.getCards().map((card, index) => {
      let item: LibraryItem;

      const spec: SortableSpec<DeckItem, any> = {
        ...this.deckSpec,
        createData: () => item
      };

      item = {
        card,
        pane: DeckEditPane.LIBRARY,
        count: 1,
        scanUrl: this.cardsBaseService.getScanUrl(card),
        spec
      };
      return item;
    });
  }

  private moveDeckCards(item: DraggedItem<DeckItem>) {
    const temp = this.list.slice();
    const index = this.list.findIndex(i => i.card.fullName === item.data.card.fullName);
    let data: DeckItem = item.data;

    if (item.isInternal) {
      temp.splice(item.index, 1);

    } else {
      data = { ...item.data, pane: DeckEditPane.DECK, count: 0 };
      if (index !== -1) {
        data.count = this.list[index].count;
        temp.splice(index, 1);
      }
    }

    // Find place to put the transit object
    let target = item.hover.index;
    if (target === -1) {
      target = index;
    }
    if (target === -1) {
      target = temp.length;
    }

    temp.splice(target, 0, data);
    return temp;
  }

  private initDropTarget(pane: DeckEditPane): [DropTarget<DraggedItem<DeckItem>, any>, Observable<boolean>]  {
    let dropTarget: DropTarget<DraggedItem<DeckItem>, any>;
    let highlight$: Observable<boolean>;

    dropTarget = this.dnd.dropTarget(DeckCardType, {
      canDrop: monitor => {
        const card = monitor.getItem().data;
        return card.pane !== pane;
      },
      drop: monitor => {
        // Card already dropped on the list
        if (this.hasDropped) {
          return;
        }
        const card = monitor.getItem().data;
        this.ngZone.run(() => pane === DeckEditPane.LIBRARY
          ? this.removeCardFromDeck(card)
          : this.addCardToDeck(card));
      }
    });

    const dropState = dropTarget.listen(monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }));

    highlight$ = dropState.pipe(map(state => state.canDrop && state.isOver));

    return [ dropTarget, highlight$ ];
  }

  public async addCardToDeck(item: DeckItem) {
    const index = this.tempList.findIndex(c => c.card.fullName === item.card.fullName);

    const count = 1;
    const list = this.tempList.slice();
    if (index === -1) {
      list.push({ ...item, pane: DeckEditPane.DECK, count });
    } else {
      list[index].count += count;
    }

    this.tempList = this.list = list;
    this.deckItemsChange.next(list);
  }

  public async removeCardFromDeck(item: DeckItem) {
    const index = this.tempList.findIndex(c => c.card.fullName === item.card.fullName);
    if (index === -1) {
      return;
    }

    const count = 1;
    const list = this.tempList.slice();
    if (list[index].count <= count) {
      list.splice(index, 1);
    } else {
      list[index].count -= count;
    }

    this.tempList = this.list = list;
    this.deckItemsChange.next(list);
  }

  public async setCardCount(item: DeckItem) {
    const MAX_CARD_VALUE = 99;
    const index = this.tempList.findIndex(c => c.card.fullName === item.card.fullName);
    if (index !== -1) {
      item = this.tempList[index];
    }

    const count = await this.alertService.inputNumber({
      title: 'How many cards?',
      value: item.count,
      minValue: 0,
      maxValue: MAX_CARD_VALUE
    });
    if (count === undefined) {
      return;
    }

    const list = this.tempList.slice();
    if (index === -1 && count === 0) {
      return;
    } else if (index === -1) {
      list.push({ ...item, pane: DeckEditPane.DECK, count });
    } else {
      if (count > 0) {
        list[index].count = count;
      } else {
        list.splice(index, 1);
      }
    }

    this.tempList = this.list = list;
    this.deckItemsChange.next(list);
  }

  public showCardInfo(item: LibraryItem) {
    this.cardsBaseService.showCardInfo({ card: item.card });
  }

  ngOnInit() {
    this.cards = this.loadLibraryCards();
  }

  ngOnDestroy() {
    this.deckTarget.unsubscribe();
  }

}
