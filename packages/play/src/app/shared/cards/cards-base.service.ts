import { Injectable } from '@angular/core';
import { Card, StateSerializer, SuperType, PokemonCard, EnergyCard, CardType,
  TrainerCard, CardsInfo, CardManager } from '@ptcg/common';

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
  private cardManager: CardManager;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private sessionService: SessionService
  ) {
    this.cardManager = CardManager.getInstance();
  }

  public loadCardsInfo(cardsInfo: CardsInfo) {
    this.cardManager.loadCardsInfo(cardsInfo);
    this.cards = this.cardManager.getAllCards().slice();
    this.names = this.cards.map(c => c.fullName);
    this.cards.sort(this.compareCards);
    StateSerializer.setKnownCards(this.cards);
  }

  private compareCards(c1: Card, c2: Card) {
    if (c1.superType !== c2.superType) {
      return c1.superType - c2.superType;
    }
    switch (c1.superType) {
      case SuperType.POKEMON: {
        const p1 = c1 as PokemonCard;
        const p2 = c2 as PokemonCard;
        const type1 = p1.cardTypes.length > 0 ? p1.cardTypes[0] : CardType.ANY;
        const type2 = p2.cardTypes.length > 0 ? p2.cardTypes[0] : CardType.ANY;
        if (type1 !== type2) {
          return type1 - type2;
        }
        break;
      }
      case SuperType.ENERGY: {
        const e1 = c1 as EnergyCard;
        const e2 = c2 as EnergyCard;
        if (e1.energyType !== e2.energyType) {
          return e1.energyType - e2.energyType;
        }
        const type1 = e1.provides.length > 0 ? e1.provides[0] : CardType.ANY;
        const type2 = e2.provides.length > 0 ? e2.provides[0] : CardType.ANY;
        if (type1 !== type2) {
          return type1 - type2;
        }
        break;
      }
      case SuperType.TRAINER: {
        const t1 = c1 as TrainerCard;
        const t2 = c2 as TrainerCard;
        if (t1.trainerType !== t2.trainerType) {
          return t1.trainerType - t2.trainerType;
        }
      }
    }
    return c1.fullName < c2.fullName ? -1 : 1;
  }

  public getAllFormats() {
    return this.cardManager.getAllFormats();
  }

  public getCards(): Card[] {
    return this.cards;
  }

  public getCardNames(): string[] {
    return this.names;
  }

  public isCardFromFormat(cardName: string, name: string): boolean {
    return this.cardManager.getCardFormats(cardName).some(f => f.name === name);
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
    return this.cardManager.getCardByName(cardName);
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
