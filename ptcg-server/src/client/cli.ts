import * as repl from 'repl';
import { Help } from './help';
import { Storage } from './storage';

export class Cli {

  private welcomeMessage: string = '';
  private context: any;
  private help: Help = new Help();

  constructor() {
    this.welcomeMessage = 'ptcg-server command line interface. Type \'help()\' for command list.';
  }

  public setWelcomeMessage(message: string): void {
    this.welcomeMessage = message;
  }

  public start(): void {
    if (this.welcomeMessage) {
      console.log(this.welcomeMessage);
    }

    let server: repl.REPLServer = repl.start('> ');
    this.context = server.context;
    
    this.addGlobalProperty('help', this.help.createHelpFunction());
    this.addGlobalProperty('storage', new Storage());    
  }

  public addGlobalProperty(name: string, propertyValue: any): void {
    Object.defineProperty(this.context, name, {
      configurable: false,
      enumerable: true,
      value: propertyValue
    });

    const construct: any = propertyValue.constructor;
    const description = construct ? construct.shortHelp || construct.help : undefined;
    if (description) {
      this.help.addCommand(name, description);
    }
  }

}
