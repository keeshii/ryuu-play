import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

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
