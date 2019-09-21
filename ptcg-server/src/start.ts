import { App } from './backend';
import { config, readConfig } from './utils';
import { exit } from 'process';

const app = new App();

readConfig()
  .then(() => app.connectToDatabase())
  .then(() => app.start())
  .then(() => {
    const address = config.backend.address;
    const port = config.backend.port;
    console.log('Application started on ' + address + ':' + port + '.');
  })
  .catch(error => {
    console.error(error);
    console.log('Application not started.');
    exit(1);
  });
