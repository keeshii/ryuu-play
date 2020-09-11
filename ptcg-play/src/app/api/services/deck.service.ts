import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { DeckListResponse, DeckResponse } from '../interfaces/deck.interface';
import { Response } from '../interfaces/response.interface';


@Injectable()
export class DeckService {

  constructor(
    private api: ApiService,
  ) {}

  public getList() {
    return this.api.get<DeckListResponse>('/v1/decks/list');
  }

  public getDeck(deckId: number) {
    return this.api.get<DeckResponse>('/v1/decks/get/' + deckId);
  }

  public createDeck(deckName: string) {
    return this.api.post<DeckResponse>('/v1/decks/save', {
      name: deckName,
      cards: []
    });
  }

  public saveDeck(deckId: number, name: string, cards: string[]) {
    return this.api.post<DeckResponse>('/v1/decks/save', {
      id: deckId,
      name,
      cards
    });
  }

  public deleteDeck(deckId: number) {
    return this.api.post<Response>('/v1/decks/delete', {
      id: deckId
    });
  }

  public rename(deckId: number, name: string) {
    return this.api.post<Response>('/v1/decks/rename', {
      id: deckId,
      name
    });
  }

  public duplicate(deckId: number, name: string) {
    return this.api.post<Response>('/v1/decks/duplicate', {
      id: deckId,
      name
    });
  }

}
