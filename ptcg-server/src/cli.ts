import { Cli } from './client';
import { readConfig } from './utils/config';

(async () => {
  await readConfig();

  const cli = new Cli();
  cli.start();
})();
