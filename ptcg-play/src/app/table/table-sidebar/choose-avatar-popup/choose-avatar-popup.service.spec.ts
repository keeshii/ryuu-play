import { TestBed } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { ChooseAvatarPopupService } from './choose-avatar-popup.service';

describe('ChooseAvatarPopupService', () => {
  let service: ChooseAvatarPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: { openDialog: () => {} } }]
    });
    service = TestBed.inject(ChooseAvatarPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
