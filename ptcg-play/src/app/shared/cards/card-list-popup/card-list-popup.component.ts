import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Card, CardList } from 'ptcg-server';
import { CardInfoPaneOptions } from '../card-info-pane/card-info-pane.component';

export interface CardListPopupData {
  card?: Card;
  cardList?: CardList;
  facedown?: boolean;
}

@Component({
  selector: 'ptcg-card-list-popup',
  templateUrl: './card-list-popup.component.html',
  styleUrls: ['./card-list-popup.component.scss']
})
export class CardListPopupComponent {

  public card: Card;
  public cardList: CardList;
  public facedown: boolean;
  public options: CardInfoPaneOptions;

  constructor(
    private dialogRef: MatDialogRef<CardListPopupComponent>,
    @Inject(MAT_DIALOG_DATA) data: CardListPopupData,
  ) {
    this.card = data.card;
    this.cardList = data.cardList;
    this.facedown = data.facedown;
  }

  public close(result?: Card) {
    this.dialogRef.close(result);
  }

}
