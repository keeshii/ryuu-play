import { TestBed } from '@angular/core/testing';

import { UserInfoPopupService } from './user-info-popup.service';

describe('UserInfoPopupService', () => {
  let service: UserInfoPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInfoPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
