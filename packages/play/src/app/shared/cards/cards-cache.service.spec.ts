import { TestBed } from '@angular/core/testing';

import { CardsCacheService } from './cards-cache.service';

describe('CardsCacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: []
  }));

  it('should be created', () => {
    const service: CardsCacheService = TestBed.inject(CardsCacheService);
    expect(service).toBeTruthy();
  });
});
