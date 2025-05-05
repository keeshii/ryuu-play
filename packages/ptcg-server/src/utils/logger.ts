import { config } from '../config';

export class Logger {

  public log(message: string): void {
    if (!config.core.debug) {
      return;
    }
    console.log(message);
  }

}

export const logger = new Logger();
