import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card, SuperType, Stage, PowerType, EnergyType, TrainerType } from 'ptcg-server';
import { MatDialog } from '@angular/material/dialog';

import { CardImagePopupComponent } from '../card-image-popup/card-image-popup.component';

export interface CardInfoPaneOptions {
  enableAbility?: boolean;
  enableAttack?: boolean;
  enableTrainer?: boolean;
}

export interface CardInfoPaneAction {
  attack?: string;
  ability?: string;
  trainer?: boolean;
}

@Component({
  selector: 'ptcg-card-info-pane',
  templateUrl: './card-info-pane.component.html',
  styleUrls: ['./card-info-pane.component.scss']
})
export class CardInfoPaneComponent implements OnInit {

  @Input() card: Card;
  @Input() facedown: boolean;
  @Input() options: CardInfoPaneOptions = {};
  @Output() action = new EventEmitter<any>();

  public SuperType = SuperType;
  public Stage = Stage;
  public PowerType = PowerType;
  public EnergyType = EnergyType;
  public TrainerType = TrainerType;

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  public clickAction(action: CardInfoPaneAction) {
    this.action.next(action);
  }

  public showCardImage(card: Card, facedown: boolean): Promise<void> {
    const dialog = this.dialog.open(CardImagePopupComponent, {
      maxWidth: '100%',
      data: { card, facedown }
    });

    return dialog.afterClosed().toPromise()
      .catch(() => false);
  }

}
