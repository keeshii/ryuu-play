import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Card } from '@ryuu-play/ptcg-server';
import { DraggedItem } from '@ng-dnd/sortable';

import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { PromptCardType, PromptItem } from '../prompt-card-item.interface';
import { ChooseCardsSortable } from './choose-cards-panes.interface';


@Component({
  selector: 'ptcg-choose-cards-panes',
  templateUrl: './choose-cards-panes.component.html',
  styleUrls: ['./choose-cards-panes.component.scss']
})
export class ChooseCardsPanesComponent implements OnChanges {

  public readonly topListId = 'CHOOSE_CARDS_TOP_LIST';
  public readonly bottomListId = 'CHOOSE_CARDS_BOTTOM_LIST';

  @Input() cards: Card[];
  @Input() filter: Partial<Card> = {};
  @Input() blocked: number[] = [];
  @Input() cardbackMap: {[index: number]: boolean} = {};
  @Input() singlePaneMode = false;
  @Output() changeCards = new EventEmitter<number[]>();

  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public filterMap: {[fullName: string]: boolean} = {};
  public topSortable: ChooseCardsSortable;
  public bottomSortable: ChooseCardsSortable;

  constructor(
    private cardsBaseService: CardsBaseService
  ) {
    this.topSortable = this.buildPromptSortable();
    this.bottomSortable = this.buildPromptSortable();
  }

  public showCardPopup(context: DraggedItem<PromptItem>) {
    const card = context.data.card;
    const facedown = this.cardbackMap[context.data.index];
    this.cardsBaseService.showCardInfo({ card, facedown });
  }

  private buildPromptSortable(): ChooseCardsSortable {
    const sortable: ChooseCardsSortable = {
      list: [],
      tempList: [],
      spec: undefined
    };

    sortable.spec = {
      type: PromptCardType,
      trackBy: item => item.index,
      hover: item => {
        this.updateTempLists(sortable, item);
      },
      drop: item => {
        this.updateTempLists(sortable, item);
        this.commitTempLists();
      },
      canDrag: item => item.isAvailable,
      endDrag: () => {
        this.revertTempLists();
      }
    };

    return sortable;
  }

  private buildFilterMap(cards: Card[], filter: Partial<Card>, blocked: number[]) {
    const filterMap: {[fullName: string]: boolean} = {};
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      let isBlocked = blocked.includes(i);
      if (isBlocked === false) {
        for (const key in filter) {
          if (filter.hasOwnProperty(key)) {
            isBlocked = isBlocked || (filter as any)[key] !== (card as any)[key];
          }
        }
      }
      filterMap[card.fullName] = !isBlocked;
    }
    return filterMap;
  }

  private buildCardList(cards: Card[]): PromptItem[] {
    return cards.map((card, index) => {
      const item: PromptItem = {
        card,
        index,
        isAvailable: this.filterMap[card.fullName],
        isSecret: !!this.cardbackMap[index],
        scanUrl: this.cardsBaseService.getScanUrl(card)
      };
      return item;
    });
  }

  private updateTempLists(sortable: ChooseCardsSortable, item: DraggedItem<PromptItem>) {
    let topList = this.topSortable.tempList;
    let bottomList = this.bottomSortable.tempList;

    const topIndex = topList.findIndex(i => i.index === item.data.index);
    const bottomIndex = bottomList.findIndex(i => i.index === item.data.index);

    if (topIndex !== -1) {
      topList = topList.slice();
      topList.splice(topIndex, 1);
    }

    if (bottomIndex !== -1) {
      bottomList = bottomList.slice();
      bottomList.splice(bottomIndex, 1);
    }

    if (sortable === this.topSortable) {
      topList = topIndex !== -1 ? topList : topList.slice();
      topList.splice(item.hover.index, 0, item.data);
    }

    if (sortable === this.bottomSortable) {
      bottomList = bottomIndex !== -1 ? bottomList : bottomList.slice();
      bottomList.splice(item.hover.index, 0, item.data);
    }

    if (topList !== this.topSortable.tempList) {
      this.topSortable.tempList = topList;
    }

    if (bottomList !== this.bottomSortable.tempList) {
      this.bottomSortable.tempList = bottomList;
    }
  }

  private commitTempLists() {
    this.topSortable.list = this.topSortable.tempList.slice();
    this.bottomSortable.list = this.bottomSortable.tempList.slice();

    const result = this.singlePaneMode
      ? this.topSortable.list.map(i => i.index)
      : this.bottomSortable.list.map(i => i.index);

    this.changeCards.next(result);
  }

  private revertTempLists() {
    this.topSortable.tempList = this.topSortable.list.slice();
    this.bottomSortable.tempList = this.bottomSortable.list.slice();
  }

  ngOnChanges() {
    if (this.cards && this.filter && this.blocked) {
      this.filterMap = this.buildFilterMap(this.cards, this.filter, this.blocked);
      this.topSortable.tempList = this.buildCardList(this.cards);
      this.bottomSortable.tempList = [];
      this.commitTempLists();
    }
  }

}
