import { Injectable } from '@angular/core';
import { Card } from 'ptcg-server';
import { take } from 'rxjs/operators';

import { CardInfoPopupData, CardInfoPopupComponent } from './card-info-popup/card-info-popup.component';
import { CardsService } from '../../api/services/cards.service';
import { MatDialog } from '@angular/material';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardsBaseService {

  public scansUrl: string;
  private cards: Card[] = [];
  private names: string[] = [];

  constructor(
    private cardsService: CardsService,
    private dialog: MatDialog
  ) { }

  public loadCards() {
    this.cardsService.getAll()
      .pipe(take(1))
      .subscribe(response => {
        this.cards = response.cards;
        this.names = this.cards.map(c => c.fullName);
        this.scansUrl = response.scansUrl;
      }, () => {});
  }

  public getCards(): Card[] {
    return this.cards;
  }

  public getCardNames(): string[] {
    return this.names;
  }

  public getScanUrl(name: string): string {
    return environment.apiUrl + this.scansUrl.replace('{name}', name);
  }

  public getCardByName(cardName: string): Card | undefined {
    return this.cards.find(c => c.fullName === cardName);
  }

  public showCardInfo(card: Card, options: CardInfoPopupData = {}): Promise<void> {

    const dialog = this.dialog.open(CardInfoPopupComponent, {
      maxWidth: '100%',
      width: '650px',
      data: {...options, card }
    });

    return dialog.afterClosed().toPromise()
      .catch(() => undefined);
  }

}
