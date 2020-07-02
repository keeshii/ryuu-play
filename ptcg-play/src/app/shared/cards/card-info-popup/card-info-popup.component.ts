import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Card, SuperType } from 'ptcg-server';

export interface CardInfoPopupData {
  card: Card;
  enableAbility?: boolean;
  enableAttack?: boolean;
  enableRetreat?: boolean;
  hideImage?: boolean;
}

@Component({
  selector: 'ptcg-card-info-popup',
  templateUrl: './card-info-popup.component.html',
  styleUrls: ['./card-info-popup.component.scss']
})
export class CardInfoPopupComponent implements OnInit {

  public card: Card;
  public SuperType = SuperType;

  constructor(
    private dialogRef: MatDialogRef<CardInfoPopupComponent>,
    @Inject(MAT_DIALOG_DATA) data: CardInfoPopupData,
  ) {
    this.card = data.card;
  }

  ngOnInit() {
  }

}
