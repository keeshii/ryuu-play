import * as repl from 'repl';

export class Console {

  private welcomeMessage: string = '';
  private context: any;

  constructor() { }

  public setWelcomeMessage(message: string): void {
    this.welcomeMessage = message;
  }

  public start(): void {
    if (this.welcomeMessage) {
      console.log(this.welcomeMessage);
    }

    let server: repl.REPLServer = repl.start('> ');
    this.context = server.context;
  }

  public addGlobalProperty(name: string, propertyValue: any): void {
    Object.defineProperty(this.context, name, {
      configurable: false,
      enumerable: true,
      value: propertyValue
    });
  }

}
