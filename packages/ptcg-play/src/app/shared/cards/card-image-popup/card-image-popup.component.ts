import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Card } from '@ryuu-play/ptcg-server';

@Component({
  selector: 'ptcg-card-image-popup',
  templateUrl: './card-image-popup.component.html',
  styleUrls: ['./card-image-popup.component.scss']
})
export class CardImagePopupComponent {

  public card: Card;
  public facedown: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { card: Card, facedown: boolean },
  ) {
    this.card = data.card;
    this.facedown = data.facedown;
  }

}
