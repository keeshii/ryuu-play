import { Injectable } from '@angular/core';
import { Card, StateSerializer } from 'ptcg-server';
import { take } from 'rxjs/operators';

import { CardInfoPopupData, CardInfoPopupComponent, CardInfoPopupResponse } from './card-info-popup/card-info-popup.component';
import { CardsService } from '../../api/services/cards.service';
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
    private cardsService: CardsService,
    private dialog: MatDialog,
    private sessionService: SessionService
  ) { }

  public loadCards() {
    this.cardsService.getAll()
      .pipe(take(1))
      .subscribe(response => {
        this.cards = response.cards;
        this.names = this.cards.map(c => c.fullName);
        StateSerializer.setKnownCards(this.cards);
      }, () => {});
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

  public showCardInfo(card: Card, options: CardInfoPopupData = {}): Promise<CardInfoPopupResponse> {

    const dialog = this.dialog.open(CardInfoPopupComponent, {
      maxWidth: '100%',
      width: '650px',
      data: {...options, card }
    });

    return dialog.afterClosed().toPromise()
      .catch(() => undefined);
  }

}
