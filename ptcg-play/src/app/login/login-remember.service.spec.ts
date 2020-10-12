import { TestBed } from '@angular/core/testing';

import { LoginRememberService } from './login-remember.service';

describe('LoginRememberService', () => {
  let service: LoginRememberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginRememberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
