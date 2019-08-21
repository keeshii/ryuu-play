import { TestBed } from '@angular/core/testing';

import { LoginPopupService } from './login-popup.service';

describe('LoginService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginPopupService = TestBed.get(LoginPopupService);
    expect(service).toBeTruthy();
  });
});
