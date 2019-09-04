import { Console, Help } from './console';
import { Storage } from './storage';

const cli = new Console();
cli.setWelcomeMessage('ptcg-server command line interface. Type \'help()\' for command list.');
cli.start();

const help = new Help();
help.setHelpMessage(
  'help - displays help message \n' +
  'storage - access to the database'
);

cli.addGlobalProperty('help', help.createHelpFunction());
cli.addGlobalProperty('storage', new Storage());
