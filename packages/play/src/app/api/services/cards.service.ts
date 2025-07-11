import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { Card } from '@ptcg/common';

import { ApiService } from '../api.service';
import { CardsData, CardsInfoResponse, CardsResponse } from '../interfaces/cards.interface';
import { CardsCacheService } from '../../shared/cards/cards-cache.service';

@Injectable()
export class CardsService {

  constructor(
    private api: ApiService,
    private cardsCacheService: CardsCacheService
  ) { }

  /**
   * Reads cards from cache (indexed-db) or fetch all cards from the server.
   */
  public getCardData(): Observable<CardsData> {
    // Get the up-date cards info
    return this.getInfo().pipe(switchMap(response => {

      // Load data from cache
      return this.cardsCacheService.getCardsData().pipe(
        // Error while reading data from db, handle it as data didn't exist
        catchError(() => of(undefined)),

        // Check if cards from cache are up-to-date
        map((data: CardsData | undefined) => {
          if (data === undefined || !data.cardsInfo) {
            return undefined;
          }

          if (response.cardsInfo.cardsTotal !== data.cardsInfo.cardsTotal
            || response.cardsInfo.hash !== data.cardsInfo.hash) {
            return undefined;
          }

          return data;
        }),

        // No cards from cache, or invalid hash, need to fetch all cards from server
        switchMap((data: CardsData | undefined) => {
          if (data !== undefined) {
            return of(data);
          }
          return this.getAll().pipe(switchMap(cards => {
            data = { cardsInfo: response.cardsInfo, cards: cards };
            return this.cardsCacheService.saveCardsData(data).pipe(
              map(() => data),
              catchError(() => of(data))
            );
          }));
        })
      );
    }));
  }

  public getAll(): Observable<Card[]> {
    // Load cards page by page until all cards downloaded
    const nextPage = (page: number, cards: Card[]) => {
      return this.getCardsPage(page)
        .pipe(switchMap(response => {
          if (response.cards.length === 0) {
            return of(cards);
          }

          cards.push(...response.cards);
          return nextPage(page + 1, cards);
        }));
    }

    // Get all pages starting with first page and empty cards list
    return nextPage(0, []);
  }

  public getCardsPage(page: number) {
    return this.api.get<CardsResponse>('/v1/cards/get/' + page)
  }

  public getInfo() {
    return this.api.get<CardsInfoResponse>('/v1/cards/info');
  }

}
