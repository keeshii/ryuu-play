import { Component, OnInit, Input } from '@angular/core';
import { ChooseCardsPrompt, GameState, CardList, Card } from 'ptcg-server';
import { DraggedItem } from '@angular-skyhook/sortable';

import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { GameService } from '../../../api/services/game.service';
import { PromptCardType, PromptItem } from '../prompt-card-item.interface';
import { PromptSortable } from './prompt-choose-cards.interface';

@Component({
  selector: 'ptcg-prompt-choose-cards',
  templateUrl: './prompt-choose-cards.component.html',
  styleUrls: ['./prompt-choose-cards.component.scss']
})
export class PromptChooseCardsComponent implements OnInit {

  public readonly topListId = 'CHOOSE_CARDS_TOP_LIST';
  public readonly bottomListId = 'CHOOSE_CARDS_BOTTOM_LIST';

  @Input() set prompt(prompt: ChooseCardsPrompt) {
    this.allowedCancel = prompt.options.allowCancel;
    this.filter = prompt.filter;
    this.filterMap = this.buildFilterMap(prompt.cards);
    this.message = prompt.message;
    this.promptId = prompt.id;
    this.min = prompt.options.min;
    this.max = prompt.options.max;
    this.topSortable.tempList = this.buildCardList(prompt.cards);
    this.bottomSortable.tempList = [];
    this.commitTempLists();
  }

  @Input() gameState: GameState;

  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public filter: Partial<Card>;
  public filterMap: {[fullName: string]: boolean} = {};
  public topSortable: PromptSortable;
  public bottomSortable: PromptSortable;

  private min: number;
  private max: number;
  public isInvalid = false;

  constructor(
    private cardsBaseService: CardsBaseService,
    private gameService: GameService
  ) {
    this.topSortable = this.buildPromptSortable();
    this.bottomSortable = this.buildPromptSortable();
  }

  private buildPromptSortable(): PromptSortable {
    const sortable: PromptSortable = {
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

  public cancel() {
    const gameId = this.gameState.gameId;
    const id = this.promptId;
    this.gameService.resolvePrompt(gameId, id, null);
  }

  public confirm() {
    const gameId = this.gameState.gameId;
    const id = this.promptId;
    const result = this.bottomSortable.list.map(i => i.index);
    this.gameService.resolvePrompt(gameId, id, result);
  }

  private buildFilterMap(cards: CardList) {
    const filterMap: {[fullName: string]: boolean} = {};
    for (const card of cards.cards) {
      let result = false;
      for (const key in this.filter) {
        if (this.filter.hasOwnProperty(key)) {
          result = result || this.filter[key] !== card[key];
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

  private updateTempLists(sortable: PromptSortable, item: DraggedItem<PromptItem>) {
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

    let isInvalid = false;
    if (this.min !== undefined && this.min > this.bottomSortable.list.length) {
      isInvalid = true;
    }
    if (this.max !== undefined && this.max < this.bottomSortable.list.length) {
      isInvalid = true;
    }
    this.isInvalid = isInvalid;
  }

  private revertTempLists() {
    this.topSortable.tempList = this.topSortable.list.slice();
    this.bottomSortable.tempList = this.bottomSortable.list.slice();
  }

  ngOnInit() {
  }

}
