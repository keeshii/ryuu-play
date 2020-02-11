import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

import { CardsService } from '../../api/services/cards.service';
import { Card } from 'ptcg-server';

@Injectable({
  providedIn: 'root'
})
export class CardsBaseService {

  public scansUrl: string;
  private cards: Card[] = [];
  private names: string[] = [];

  constructor(
    private cardsService: CardsService
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

  public getCardByName(cardName: string): Card | undefined {
    return this.cards.find(c => c.fullName === cardName);
  }

}
