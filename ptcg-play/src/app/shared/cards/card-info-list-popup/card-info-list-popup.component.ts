import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Card, CardList } from 'ptcg-server';
import { CardInfoPaneOptions, CardInfoPaneAction } from '../card-info-pane/card-info-pane.component';
import { CardInfoPopupData, CardInfoPopupComponent } from '../card-info-popup/card-info-popup.component';


@Component({
  selector: 'ptcg-card-info-list-popup',
  templateUrl: './card-info-list-popup.component.html',
  styleUrls: ['./card-info-list-popup.component.scss']
})
export class CardInfoListPopupComponent {

  public card: Card;
  public cardList: CardList;
  public facedown: boolean;
  public allowReveal: boolean;
  public options: CardInfoPaneOptions;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CardInfoListPopupComponent>,
    @Inject(MAT_DIALOG_DATA) data: CardInfoPopupData,
  ) {
    this.card = data.card;
    this.cardList = data.cardList;
    this.allowReveal = data.allowReveal;
    this.facedown = data.facedown;
    this.options = data.options;
  }

  public async showCardInfo(card: Card): Promise<void> {
    this.card = card;

    const data: CardInfoPopupData = {
      card,
      facedown: this.facedown,
      options: this.options
    };

    const dialog = this.dialog.open(CardInfoPopupComponent, {
      maxWidth: '100%',
      width: '650px',
      data
    });

    const action = await dialog.afterClosed().toPromise();
    if (action) {
      this.close(action);
    }
  }

  public close(result?: CardInfoPaneAction) {
    this.dialogRef.close(result);
  }

}
