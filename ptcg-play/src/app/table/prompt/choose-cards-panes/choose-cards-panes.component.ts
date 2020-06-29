import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CardList, Card } from 'ptcg-server';
import { DraggedItem } from '@angular-skyhook/sortable';

import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { PromptCardType, PromptItem } from '../prompt-card-item.interface';
import { ChooseCardsSortable } from './choose-cards-panes.interface';


@Component({
  selector: 'ptcg-choose-cards-panes',
  templateUrl: './choose-cards-panes.component.html',
  styleUrls: ['./choose-cards-panes.component.scss']
})
export class ChooseCardsPanesComponent implements OnInit {

  public readonly topListId = 'CHOOSE_CARDS_TOP_LIST';
  public readonly bottomListId = 'CHOOSE_CARDS_BOTTOM_LIST';

  @Input() set cards(cardList: CardList) {
    this.cardList = cardList;
    this.filterMap = this.buildFilterMap(cardList, this.filterValue);
    this.topSortable.tempList = this.buildCardList(cardList);
    this.bottomSortable.tempList = [];
    this.commitTempLists();
  }

  @Input() set filter(filter: Partial<Card>) {
    this.filterValue = filter || {};
    this.filterMap = this.buildFilterMap(this.cardList, filter);
    this.topSortable.tempList = this.buildCardList(this.cardList);
    this.bottomSortable.tempList = [];
    this.commitTempLists();
  }

  @Output() change = new EventEmitter<number[]>();

  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public filterMap: {[fullName: string]: boolean} = {};
  public topSortable: ChooseCardsSortable;
  public bottomSortable: ChooseCardsSortable;

  private cardList: CardList = new CardList();
  private filterValue: Partial<Card> = {};

  constructor(
    private cardsBaseService: CardsBaseService
  ) {
    this.topSortable = this.buildPromptSortable();
    this.bottomSortable = this.buildPromptSortable();
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

  private buildFilterMap(cards: CardList, filter: Partial<Card>) {
    const filterMap: {[fullName: string]: boolean} = {};
    for (const card of cards.cards) {
      let result = false;
      for (const key in filter) {
        if (filter.hasOwnProperty(key)) {
          result = result || filter[key] !== card[key];
        }
      }
      filterMap[card.fullName] = !result;
    }
    return filterMap;
  }

  private buildCardList(cards: CardList): PromptItem[] {
    return cards.cards.map((card, index) => {
      const item: PromptItem = {
        card,
        index,
        isAvailable: this.filterMap[card.fullName],
        scanUrl: this.cardsBaseService.getScanUrl(card.fullName)
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

    const result = this.bottomSortable.list.map(i => i.index);
    this.change.next(result);
  }

  private revertTempLists() {
    this.topSortable.tempList = this.topSortable.list.slice();
    this.bottomSortable.tempList = this.bottomSortable.list.slice();
  }

  ngOnInit() {
  }

}
