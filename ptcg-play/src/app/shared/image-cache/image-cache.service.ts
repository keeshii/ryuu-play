import { Injectable } from '@angular/core';
import * as ImgCache from 'imgcache.js';

export interface ImgCacheConfig {
  /* call the log method ? */
  debug?: boolean;
  /* name of the cache folder */
  localCacheFolder?: string;
  /* use src="data:.."? otherwise will use src="filesystem:.." */
  useDataURI?: boolean;
  /* allocated cache space : here 10MB */
  chromeQuota?: number;
  /* false = use temporary cache storage */
  usePersistentCache?: boolean;
  /* size in MB that triggers cache clear on init, 0 to disable */
  cacheClearSize?: number;
  /* HTTP headers for the download requests -- e.g: headers: { 'Accept': 'application/jpg' } */
  headers?: {};
  /* indicates whether or not cross-site Access-Control requests should be made using credentials */
  withCredentials?: boolean;
  /* enable if URIs are already encoded (skips call to sanitizeURI) */
  skipURIencoding?: boolean;
  /* if specified, use one of the Cordova File plugin's app directories for storage */
  cordovaFilesystemRoot?: string;
  /* timeout delay in ms for xhr request */
  timeout?: number;
}

@Injectable()
export class ImageCacheService {

  private initialized = false;
  private cachedFilesMap: {[url: string]: string} = {};

  public init(config: ImgCacheConfig = {}) {
    Object.assign(ImgCache.options, config);

    ImgCache.init(() => {
      this.initialized = true;
    });
  }

  public getCachedUrlFromMap(url: string): string | undefined {
    return this.cachedFilesMap[url];
  }

  public fetchFromCache(url: string, callback: (url: string) => void): void {

    if (!this.initialized) {
      // ImgCache has not been initialised. Please call `init` before using the library.
      callback(url);
      return;
    }

    ImgCache.getCachedFileURL(
      url,

      // Successfully retrieved from the cache
      (src: string, dest: string) => {
        this.cachedFilesMap[url] = dest;
        callback(dest);
      },

      // File not cached,
      () => {
        ImgCache.cacheFile(
          url,
          // File added to cache, return it's URL
          (dest: string) => {
            this.cachedFilesMap[url] = dest;
            callback(dest);
          },

          // Unable to cache the file, return the original url
          () => {
            // it is unlikely we will ever success, remember the source url
            this.cachedFilesMap[url] = url;
            callback(url);
          }
        );
      }
    );
  }

  public clearCache(): Promise<void> {
    this.cachedFilesMap = {};
    return new Promise((resolve, reject) => {
      ImgCache.clearCache(resolve, reject);
    });
  }

}
