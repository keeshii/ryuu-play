import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const onDeviceReady = (callback: () => void) => {
  const hasCordova = !!(window as any).cordova;
  if (hasCordova) {
    document.addEventListener('deviceready', callback, false);
  } else {
    callback();
  }
};

onDeviceReady(() => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
