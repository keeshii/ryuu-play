import { TestBed } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { ProfilePopupService } from './profile-popup.service';

describe('ProfilePopupService', () => {
  let service: ProfilePopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: { openDialog: () => {} } }]
    });
    service = TestBed.inject(ProfilePopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
