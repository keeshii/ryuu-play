import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../api/api.module';
import { CardsBaseService } from './cards-base.service';

describe('CardsBaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      ApiModule,
      TranslateModule.forRoot()
    ]
  }));

  it('should be created', () => {
    const service: CardsBaseService = TestBed.inject(CardsBaseService);
    expect(service).toBeTruthy();
  });
});
