export class Help {

  private helpMessage: string = '';

  constructor() { }

  public createHelpFunction(): Function {
    return (context?: Object) => {
      if (typeof context === 'undefined') {
        console.log(this.helpMessage);
        return;
      }

      if (typeof context === 'object') {
        const constructor: any = context.constructor;
        if (typeof constructor.help === 'string') {
          console.log(constructor.help);
        }
      }
    };
  }

  public setHelpMessage(message: string): void {
    this.helpMessage = message;
  }

}
