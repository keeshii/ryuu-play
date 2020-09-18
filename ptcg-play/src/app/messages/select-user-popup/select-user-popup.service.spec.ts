import { TestBed } from '@angular/core/testing';

import { SelectUserPopupService } from './select-user-popup.service';

describe('SelectUserPopupService', () => {
  let service: SelectUserPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectUserPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
