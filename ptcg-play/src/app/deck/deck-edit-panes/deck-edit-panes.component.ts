import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { SkyhookDndService, DropTarget } from '@angular-skyhook/core';
import { DraggedItem, SortableSpec } from '@angular-skyhook/sortable';
import { Observable } from 'rxjs';
import { SuperType, EnergyCard, EnergyType } from 'ptcg-server';
import { map } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { DeckEditPane } from './deck-edit-pane.interface';
import { DeckCard } from '../deck-card/deck-card.interface';
import { DeckCardType } from '../deck-card/deck-card.component';

@Component({
  selector: 'ptcg-deck-edit-panes',
  templateUrl: './deck-edit-panes.component.html',
  styleUrls: ['./deck-edit-panes.component.scss']
})
export class DeckEditPanesComponent implements OnInit, OnDestroy {

  @Input() cards: DeckCard[];

  @Output() deckCardsChange = new EventEmitter<DeckCard[]>();

  @Input() set deckCards(value: DeckCard[]) {
    this.list = value;
    this.tempList = value;
  }

  public deckTarget: DropTarget<DraggedItem<DeckCard>, any>;
  public deckHighlight$: Observable<boolean>;
  public libraryTarget: DropTarget<DraggedItem<DeckCard>, any>;
  public libraryHighlight$: Observable<boolean>;
  public deckSpec: SortableSpec<DeckCard>;

  list: DeckCard[] = [];
  tempList: DeckCard[] = [];

  constructor(
    private alertService: AlertService,
    private ngZone: NgZone,
    private dnd: SkyhookDndService
  ) {
    [this.deckTarget, this.deckHighlight$] = this.initDropTarget(DeckEditPane.DECK);
    [this.libraryTarget, this.libraryHighlight$] = this.initDropTarget(DeckEditPane.LIBRARY);

    this.deckSpec = {
      type: DeckCardType,
      trackBy: x => x.fullName,
      hover: item => {
        this.tempList = this.moveDeckCards(item);
      },
      drop: item => {
        // save the changes
        this.tempList = this.list = this.moveDeckCards(item);
        this.deckCardsChange.next(this.list);
      },
      endDrag: () => {
        // revert
        this.tempList = this.list;
      }
    };
  }

  private moveDeckCards(item: DraggedItem<DeckCard>) {
    const temp = this.list.slice();
    temp.splice(item.index, 1);
    temp.splice(item.hover.index, 0, item.data);
    return temp;
  }

  private initDropTarget(pane: DeckEditPane): [DropTarget<DraggedItem<DeckCard>, any>, Observable<boolean>]  {
    let dropTarget: DropTarget<DraggedItem<DeckCard>, any>;
    let highlight$: Observable<boolean>;

    dropTarget = this.dnd.dropTarget(DeckCardType, {
      canDrop: monitor => {
        const card = monitor.getItem().data;
        return card.pane !== pane;
      },
      drop: monitor => {
        const card = monitor.getItem().data;
        this.ngZone.run(() => this.onCardDrop(card, pane));
      }
    });

    const dropState = dropTarget.listen(monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }));

    highlight$ = dropState.pipe(map(state => state.canDrop && state.isOver));

    return [ dropTarget, highlight$ ];
  }

  private onCardDrop(card: DeckCard, target: DeckEditPane) {
    return target === DeckEditPane.LIBRARY
      ? this.removeCardFromDeck(card)
      : this.addCardToDeck(card);
  }

  private async askForEnergyCount(card: DeckCard, maxValue?: number): Promise<number> {
    const DEFAULT_VALUE = 1;

    if (card.superType !== SuperType.ENERGY) {
      return DEFAULT_VALUE;
    }

    const energyCard: EnergyCard = card as any;
    if (energyCard.energyType !== EnergyType.BASIC) {
      return DEFAULT_VALUE;
    }

    const count = await this.alertService.inputNumber({
      title: 'How many energy cards?',
      value: 1,
      minValue: 1,
      maxValue
    });
    return count === undefined ? 0 : count;
  }

  public async addCardToDeck(card: DeckCard) {
    const CARDS_IN_DECK = 60;
    const index = this.list.findIndex(c => c.fullName === card.fullName);
    const count = await this.askForEnergyCount(card, CARDS_IN_DECK);
    if (count === 0) {
      return;
    }

    const list = this.list.slice();
    if (index === -1) {
      list.push({ ...card, pane: DeckEditPane.DECK, count });
    } else {
      list[index].count += count;
    }

    this.tempList = this.list = list;
    this.deckCardsChange.next(list);
  }

  public async removeCardFromDeck(card: DeckCard) {
    const index = this.list.findIndex(c => c.fullName === card.fullName);
    if (index === -1) {
      return;
    }

    const count = await this.askForEnergyCount(card, card.count);
    if (count === 0) {
      return;
    }

    const list = this.list.slice();
    if (list[index].count <= count) {
      list.splice(index, 1);
    } else {
      list[index].count -= count;
    }

    this.tempList = this.list = list;
    this.deckCardsChange.next(list);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.deckTarget.unsubscribe();
  }

}
