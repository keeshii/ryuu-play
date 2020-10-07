import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Card, CardList } from 'ptcg-server';
import { CardInfoPaneOptions, CardInfoPaneAction } from '../card-info-pane/card-info-pane.component';

export interface CardInfoPopupData {
  card?: Card;
  cardList?: CardList;
  options?: CardInfoPaneOptions;
  allowReveal?: boolean;
  facedown?: boolean;
}

export enum CardInfoPopupPanes {
  CARD,
  CARD_LIST
}

@Component({
  selector: 'ptcg-card-info-popup',
  templateUrl: './card-info-popup.component.html',
  styleUrls: ['./card-info-popup.component.scss']
})
export class CardInfoPopupComponent implements OnInit {

  public CardInfoPopupPanes = CardInfoPopupPanes;
  public card: Card;
  public cardList: CardList;
  public facedown: boolean;
  public allowReveal: boolean;
  public options: CardInfoPaneOptions;
  public pane: CardInfoPopupPanes;
  private data: CardInfoPopupData;

  constructor(
    private dialogRef: MatDialogRef<CardInfoPopupComponent>,
    @Inject(MAT_DIALOG_DATA) data: (CardInfoPopupData & {card: Card}),
  ) {
    this.data = data;
    this.card = data.card;
    this.cardList = data.cardList;
    this.facedown = data.facedown;
    this.allowReveal = data.allowReveal;
    this.options = data.options || {};
    this.pane = this.card ? CardInfoPopupPanes.CARD : CardInfoPopupPanes.CARD_LIST;
  }

  ngOnInit() {
  }

  public toggleCardList(): void {
    this.pane = this.pane === CardInfoPopupPanes.CARD
      ? CardInfoPopupPanes.CARD_LIST
      : CardInfoPopupPanes.CARD;
  }

  public selectCard(card: Card): void {
    this.card = card;
    this.pane = CardInfoPopupPanes.CARD;
  }

  public close(result: CardInfoPaneAction = {}) {
    this.dialogRef.close(result);
  }

}
