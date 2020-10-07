import { Injectable } from '@angular/core';
import { Card, StateSerializer } from 'ptcg-server';

import { CardInfoPopupData, CardInfoPopupComponent } from './card-info-popup/card-info-popup.component';
import { CardInfoPaneAction } from './card-info-pane/card-info-pane.component';
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from '../session/session.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardsBaseService {

  private cards: Card[] = [];
  private names: string[] = [];

  constructor(
    private dialog: MatDialog,
    private sessionService: SessionService
  ) { }

  public setCards(cards: Card[]) {
    this.cards = cards;
    this.names = this.cards.map(c => c.fullName);
    StateSerializer.setKnownCards(this.cards);
  }

  public getCards(): Card[] {
    return this.cards;
  }

  public getCardNames(): string[] {
    return this.names;
  }

  public getScanUrl(card: Card): string {
    const config = this.sessionService.session.config;
    const scansUrl = config && config.scansUrl || '';
    return environment.apiUrl + scansUrl
      .replace('{set}', card.set)
      .replace('{name}', card.fullName);
  }

  public getCardByName(cardName: string): Card | undefined {
    return this.cards.find(c => c.fullName === cardName);
  }

  public showCardInfo(data: CardInfoPopupData = {}): Promise<CardInfoPaneAction> {

    const dialog = this.dialog.open(CardInfoPopupComponent, {
      maxWidth: '100%',
      width: '650px',
      data
    });

    return dialog.afterClosed().toPromise()
      .catch(() => undefined);
  }

}
