import { TestBed } from '@angular/core/testing';

import { ChangePasswordPopupService } from './change-password-popup.service';

describe('ChangePasswordPopupService', () => {
  let service: ChangePasswordPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangePasswordPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
