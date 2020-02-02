import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { DeckListResponse, DeckResponse } from '../interfaces/deck.interface';

@Injectable()
export class DeckService {

  constructor(
    private api: ApiService,
  ) {}

  public getList() {
    return this.api.get<DeckListResponse>('/decks/list');
  }

  public createDeck(deckName: string) {
    return this.api.post<DeckResponse>('/decks/save', {
      name: deckName,
      cards: []
    });
  }

  public deleteDeck(deckId: number) {
    return this.api.post<DeckResponse>('/decks/delete', {
      id: deckId
    });
  }

}
