import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

import { CardEntry } from '../../api/interfaces/cards.interface';
import { CardsService } from '../../api/services/cards.service';

@Injectable({
  providedIn: 'root'
})
export class CardsBaseService {

  public scansUrl: string;
  private cards: CardEntry[] = [];
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

  public getCards(): CardEntry[] {
    return this.cards;
  }

  public getCardNames(): string[] {
    return this.names;
  }

  public getCardByName(cardName: string): CardEntry | undefined {
    return this.cards.find(c => c.fullName === cardName);
  }

}
