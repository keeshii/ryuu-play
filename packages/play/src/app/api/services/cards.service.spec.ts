import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ApiService } from '../api.service';
import { CardsService } from './cards.service';
import { CardsCacheService } from '../../shared/cards/cards-cache.service';

class ApiServiceMock {
  get(_url: string) { of(undefined); }
}

class CardsCacheServiceMock {
  getCardsInfo() { of(undefined); }
  saveCardsInfo() { of(); }
}

describe('CardsService', () => {
  let service: CardsService;
  let apiService: ApiService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      CardsService,
      { provide: ApiService, useClass: ApiServiceMock },
      { provide: CardsCacheService, useClass: CardsCacheServiceMock }
    ]
  }));

  beforeEach(() => {
    service = TestBed.inject(CardsService);
    apiService = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all cards', () => {
    spyOn(apiService, 'get');
    service.getAll();
    expect(apiService.get).toHaveBeenCalledWith('/v1/cards/all');
  });

  it('should get cards hash', () => {
    spyOn(apiService, 'get');
    service.getHash();
    expect(apiService.get).toHaveBeenCalledWith('/v1/cards/hash');
  });
});
