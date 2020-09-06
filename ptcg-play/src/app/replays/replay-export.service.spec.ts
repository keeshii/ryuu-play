import { TestBed } from '@angular/core/testing';

import { ReplayExportService } from './replay-export.service';

describe('ReplayExportService', () => {
  let service: ReplayExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReplayExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
