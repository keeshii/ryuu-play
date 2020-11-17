import { TestBed } from '@angular/core/testing';

import { ProfilePopupService } from './profile-popup.service';

describe('ProfilePopupService', () => {
  let service: ProfilePopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfilePopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
