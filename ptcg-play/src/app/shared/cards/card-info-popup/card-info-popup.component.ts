import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Card, SuperType, Stage, PowerType, EnergyType, TrainerType } from 'ptcg-server';

export interface CardInfoPopupData {
  enableAbility?: boolean;
  enableAttack?: boolean;
}

@Component({
  selector: 'ptcg-card-info-popup',
  templateUrl: './card-info-popup.component.html',
  styleUrls: ['./card-info-popup.component.scss']
})
export class CardInfoPopupComponent implements OnInit {

  public card: Card;
  public options: CardInfoPopupData;
  public SuperType = SuperType;
  public Stage = Stage;
  public PowerType = PowerType;
  public EnergyType = EnergyType;
  public TrainerType = TrainerType;
  public textOnCard: string;

  constructor(
    private dialogRef: MatDialogRef<CardInfoPopupComponent>,
    @Inject(MAT_DIALOG_DATA) data: (CardInfoPopupData & {card: Card}),
  ) {
    this.card = data.card;
    this.options = data;
  }

  ngOnInit() {
  }

  public close(result?: any) {
    this.dialogRef.close();
  }

}
