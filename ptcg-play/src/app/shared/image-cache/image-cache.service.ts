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
  private promise: Promise<object>;

  public init(config: ImgCacheConfig = {}) {
    Object.assign(ImgCache.options, config);

    this.promise = new Promise((resolve, reject) => {
      ImgCache.init(resolve, reject);
    });
    return this.promise;
  }

  public fetchFromCache(url: string): Promise<string> {
    return Promise.resolve()
      .then(() => this.checkInitialised())
      .then(() => this.cacheIfNecessary(url))
      .then(() => this.replaceWithCached(url))
      .catch(err => {
        return url;
      });
  }

  public clearCache(): Promise<null> {
    return new Promise((resolve, reject) => {
      ImgCache.clearCache(resolve, reject);
    });
  }

  private checkInitialised() {
    if (!this.promise) {
      throw new Error('ImgCache has not been initialised. Please call `init` before using the library.');
    }
  }

  private cacheIfNecessary(url: string): Promise<null> {
    return new Promise((resolve, reject) => {
      // Check if image is cached
      ImgCache.isCached(url, (path: string, success: boolean) => {
        if (success) {
          // already cached
          resolve();
        } else {
        // not there, need to cache the image
          ImgCache.cacheFile(url, resolve, reject);
        }
      });
    });
  }

  private replaceWithCached(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      ImgCache.getCachedFileURL(
        url,
        (src: string, dest: string) => resolve(dest),
        () => reject(new Error('Could not replace with cached file'))
      );
    });
  }
}
