import { TestBed } from '@angular/core/testing';

import { EditAvatarsPopupService } from './edit-avatars-popup.service';

describe('EditAvatarsPopupService', () => {
  let service: EditAvatarsPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditAvatarsPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
