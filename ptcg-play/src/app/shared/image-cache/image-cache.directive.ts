import { Directive, Input, OnDestroy, HostBinding, HostListener } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { ImageCacheService } from './image-cache.service';
import { environment } from '../../../environments/environment';
import { takeUntilDestroyed } from '../operators/take-until-destroyed';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Directive({
  selector: '[ptcgImageCache]'
})
export class ImageCacheDirective implements OnDestroy {

  private nextRequest = new Subject<string>();
  private imageLoaded = new Subject<void>();

  @HostBinding('attr.src') url: SafeUrl;
  @HostBinding('style.visibility') visiblity: 'hidden' | 'visible' = 'hidden';

  @HostListener('load', ['$event'])
  public onLoad() {
    this.imageLoaded.next();
  }

  constructor(
    private imageCacheService: ImageCacheService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnDestroy() {
  }

  @Input('ptcgImageCache')
  set src(value: string) {
    this.nextRequest.next(value);

    const url = String(value);
    if (url === '' || !environment.enableImageCache) {
      this.url = this.sanitizer.bypassSecurityTrustUrl(url);
      this.visiblity = 'visible';
      return;
    }

    const memory = this.imageCacheService.getCachedUrlFromMap(url);
    if (memory) {
      this.url = this.sanitizer.bypassSecurityTrustUrl(memory);
      this.visiblity = 'visible';
      return;
    }

    this.visiblity = 'hidden';
    this.imageCacheService.fetchFromCache(url)
      .pipe(take(1), takeUntilDestroyed(this), takeUntil(this.nextRequest))
      .subscribe({
        next: cached => {
          this.url = this.sanitizer.bypassSecurityTrustUrl(cached);
          this.imageLoaded
            .pipe(take(1), takeUntilDestroyed(this), takeUntil(this.nextRequest))
            .subscribe({ next: () => this.visiblity = 'visible' });
        }
      });
  }
}
