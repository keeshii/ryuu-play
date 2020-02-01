import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { DeckResponse } from '../interfaces/deck.interface';

@Injectable()
export class DeckService {

  constructor(
    private api: ApiService,
  ) {}

  public getList() {
    return this.api.get<DeckResponse>('/decks/list');
  }

}
