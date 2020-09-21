import { TestBed } from '@angular/core/testing';

import { ChooseAvatarPopupService } from './choose-avatar-popup.service';

describe('ChooseAvatarPopupService', () => {
  let service: ChooseAvatarPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChooseAvatarPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
