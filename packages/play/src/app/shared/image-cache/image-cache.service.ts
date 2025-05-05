import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
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
  private inProgressMap: {[url: string]: Subject<string>} = {};

  constructor(
    private ngZone: NgZone
  ) {}

  public init(config: ImgCacheConfig = {}) {
    Object.assign(ImgCache.options, config);

    ImgCache.init(() => {
      this.initialized = true;
    });
  }

  public getCachedUrlFromMap(url: string): string | undefined {
    return this.cachedFilesMap[url];
  }

  public fetchFromCache(url: string): Observable<string> {

    if (!this.initialized) {
      // ImgCache has not been initialised. Please call `init` before using the library.
      return of(url);
    }

    if (this.inProgressMap[url]) {
      return this.inProgressMap[url].asObservable();
    }

    this.inProgressMap[url] = new Subject();

    ImgCache.getCachedFileURL(
      url,

      // Successfully retrieved from the cache
      (src: string, dest: string) => {
        this.cachedFilesMap[url] = dest;
        this.ngZone.run(() => { this.setImageLoaded(url, dest); });
      },

      // File not cached,
      () => {
        ImgCache.cacheFile(
          url,
          // File added to cache, return it's URL
          (dest: string) => {
            this.cachedFilesMap[url] = dest;
            this.ngZone.run(() => { this.setImageLoaded(url, dest); });
          },

          // Unable to cache the file, return the original url
          () => {
            // return the original url path
            this.ngZone.run(() => { this.setImageLoaded(url, url); });
          }
        );
      }
    );

    return this.inProgressMap[url].asObservable();
  }

  private setImageLoaded(url: string, cached: string) {
    this.inProgressMap[url].next(cached);
    this.inProgressMap[url].complete();
    delete this.inProgressMap[url];
  }

  public clearCache(): Promise<void> {
    this.cachedFilesMap = {};
    return new Promise((resolve, reject) => {
      ImgCache.clearCache(resolve, reject);
    });
  }

}
