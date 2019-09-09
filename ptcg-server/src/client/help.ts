export class Help {

  private commandList: string[] = [];

  constructor() { }

  public createHelpFunction(): Function {
    const fn: Function = (context?: Object) => {     
      if (typeof context === 'undefined') {
        console.log(this.getCommandList());
        return;
      }

      if (typeof context === 'object') {
        const constructor: any = context.constructor;
        if (typeof constructor.help === 'string') {
          console.log(constructor.help);
        }
      }
    };
    (fn.constructor as any).help = 'Displays help of provided context';
    return fn;
  }

  public reset(): void {
    this.commandList.length = 0;
  }

  public getCommandList(): string {
    return this.commandList.join('\n');
  }

  public addCommand(name: string, description: string): void {
    this.commandList.push(name + ' - ' + description);
  }

}
