import { TestBed } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { UserInfoPopupService } from './user-info-popup.service';

describe('UserInfoPopupService', () => {
  let service: UserInfoPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: { openDialog: () => {} } }]
    });
    service = TestBed.inject(UserInfoPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
