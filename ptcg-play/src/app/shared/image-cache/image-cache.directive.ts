import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

import { ImageCacheService } from './image-cache.service';
import { environment } from '../../../environments/environment';


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

      if (!environment.enableImageCache) {
        this.renderer.setAttribute(this.el.nativeElement, 'src', url);
        return;
      }

      const memory = this.imageCacheService.getCachedUrlFromMap(url);
      if (memory) {
        this.renderer.setAttribute(this.el.nativeElement, 'src', memory);
        return;
      }

      this.renderer.setStyle(this.el.nativeElement, 'visibility', 'hidden');
      this.imageCacheService.fetchFromCache(url, cached => {
        this.renderer.setAttribute(this.el.nativeElement, 'src', cached);
        this.renderer.setStyle(this.el.nativeElement, 'visibility', 'visible');
      });
    }
  }
}
