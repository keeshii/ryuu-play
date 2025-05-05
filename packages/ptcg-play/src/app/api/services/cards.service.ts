import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { CardsResponse } from '../interfaces/cards.interface';

@Injectable()
export class CardsService {

  constructor(
    private api: ApiService,
  ) {}

  public getAll() {
    return this.api.get<CardsResponse>('/v1/cards/all');
  }

}
