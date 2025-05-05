import { TestBed } from '@angular/core/testing';

import { ImageCacheService } from './image-cache.service';

describe('ImageCacheService', () => {
  let service: ImageCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ImageCacheService ]
    });
    service = TestBed.inject(ImageCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
