import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

import { ImageCacheService } from './image-cache.service';


@Directive({
  selector: '[ptcgImageCache]'
})
export class ImageCacheDirective {
  constructor(
    private imageCacheService: ImageCacheService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @Input('ptcgImageCache')
  set src(value: string) {
    const url = String(value);
    if (url !== '') {
      this.imageCacheService
        .fetchFromCache(url)
        .then(cached => {
          this.renderer.setAttribute(this.el.nativeElement, 'src', cached);
        });
    }
  }
}
