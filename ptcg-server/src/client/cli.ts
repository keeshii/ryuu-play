import * as repl from 'repl';
import * as vm from 'vm';
import { Help } from './help';
import { Storage } from './storage';

export class Cli {

  private welcomeMessage: string = '';
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

    let server: repl.REPLServer = repl.start({
      prompt: '> ',
      eval: function(cmd: string, ctx: any, fileName: string, cb: Function): any {
        let result = vm.runInContext(cmd, ctx);
        if (result instanceof Promise) {
          return result.then(response => cb(null, response));
        }
        return cb(null, result);
      }
    });
    this.initContext(server.context);
    server.on('reset', this.initContext.bind(this));
  }

  private initContext(context: any): void {
    this.help.reset();
    this.addGlobalProperty(context, 'help', this.help.createHelpFunction());
    this.addGlobalProperty(context, 'storage', new Storage());    
  }

  public addGlobalProperty(context: any, name: string, propertyValue: any): void {
    Object.defineProperty(context, name, {
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
