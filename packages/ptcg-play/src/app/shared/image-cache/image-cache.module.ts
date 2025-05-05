import { NgModule } from '@angular/core';

import { ImageCacheDirective } from './image-cache.directive';
import { ImageCacheService, ImgCacheConfig } from './image-cache.service';
import { environment } from '../../../environments/environment';

declare let cordova: any;

@NgModule({
  declarations: [ ImageCacheDirective ],
  exports: [ ImageCacheDirective ],
  providers: [ ImageCacheService ]
})
export class ImageCacheModule {
  constructor(imageCacheService: ImageCacheService) {
    if (environment.enableImageCache) {
      const options: ImgCacheConfig = {};

      // increase allocated space on Chrome to 50MB, default was 10MB
      options.chromeQuota = 50 * 1024 * 1024;

      options.timeout = environment.timeout;

      const hasCordova = !!(window as any).cordova;

      if (hasCordova) {
        // Instead of using the PERSISTENT or TEMPORARY filesystems, use one of the
        // Cordova File plugin's app directories
        // (https://github.com/apache/cordova-plugin-file#where-to-store-files).
        // This is friendlier in a mobile application environment as we are able to store
        // files in the correct platform-recommended/enforced directories.
        // WARNING: Make sure this points to a __directory__!
        // NOTE: Only has effect when running in a Cordova environment
        options.cordovaFilesystemRoot = cordova.file.dataDirectory;
      }

      imageCacheService.init(options);
    }
  }
}
