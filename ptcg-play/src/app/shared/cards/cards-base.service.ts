import { Injectable } from '@angular/core';
import { Card, StateSerializer, SuperType, PokemonCard, EnergyCard, CardType, TrainerCard } from 'ptcg-server';

import { ApiService } from '../../api/api.service';
import { CardInfoPopupData, CardInfoPopupComponent } from './card-info-popup/card-info-popup.component';
import { CardInfoListPopupComponent } from './card-info-list-popup/card-info-list-popup.component';
import { CardInfoPaneAction } from './card-info-pane/card-info-pane.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { SessionService } from '../session/session.service';

@Injectable({
  providedIn: 'root'
})
export class CardsBaseService {

  private cards: Card[] = [];
  private names: string[] = [];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private sessionService: SessionService
  ) { }

  public setCards(cards: Card[]) {
    this.cards = cards;
    this.names = this.cards.map(c => c.fullName);
    this.cards.sort(this.compareCards);
    StateSerializer.setKnownCards(this.cards);
  }

  private compareCards(c1: Card, c2: Card) {
    if (c1.superType !== c2.superType) {
      return c1.superType - c2.superType;
    }
    switch (c1.superType) {
      case SuperType.POKEMON:
        const p1 = c1 as PokemonCard;
        const p2 = c2 as PokemonCard;
        if (p2.cardType !== p1.cardType) {
          return p1.cardType - p2.cardType;
        }
        break;
      case SuperType.ENERGY:
        const e1 = c1 as EnergyCard;
        const e2 = c2 as EnergyCard;
        if (e1.energyType !== e2.energyType) {
          return e1.energyType - e2.energyType;
        }
        const type1 = e1.provides.length > 0 ? e1.provides[0] : CardType.NONE;
        const type2 = e2.provides.length > 0 ? e2.provides[0] : CardType.NONE;
        if (type1 !== type2) {
          return type1 - type2;
        }
        break;
      case SuperType.TRAINER:
        const t1 = c1 as TrainerCard;
        const t2 = c2 as TrainerCard;
        if (t1.trainerType !== t2.trainerType) {
          return t1.trainerType - t2.trainerType;
        }
    }
    return c1.fullName < c2.fullName ? -1 : 1;
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
    const apiUrl = this.apiService.getApiUrl();
    return apiUrl + scansUrl
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

  public showCardInfoList(data: CardInfoPopupData = {}): Promise<CardInfoPaneAction> {
    if (data.cardList === undefined) {
      return this.showCardInfo(data);
    }

    const dialog = this.dialog.open(CardInfoListPopupComponent, {
      maxWidth: '100%',
      width: '670px',
      data
    });

    return dialog.afterClosed().toPromise()
      .catch(() => undefined);
  }

}
