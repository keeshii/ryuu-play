import { App } from './backend';
import { readConfig } from './utils/config';

(async () => {
  console.log('Reading config file');
  await readConfig();

  console.log('Starting the backend');
  const app = new App();
  app.start();
})();
