import { TestBed } from '@angular/core/testing';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { RouterTestingModule } from '@angular/router/testing';

import { CanActivateService } from './can-activate.service';

describe('CanActivateService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ MatDialogModule, RouterTestingModule ]
  }));

  it('should be created', () => {
    const service: CanActivateService = TestBed.inject(CanActivateService);
    expect(service).toBeTruthy();
  });
});
