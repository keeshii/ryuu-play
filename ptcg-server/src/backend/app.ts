import * as express from 'express';
import { config } from '../utils/config';

export class App {

  private app: express.Application;

  constructor() {
    this.app = express();
  }

  public async start(): Promise<void> {
    const port = config.backend.port;

    this.app.listen(port, () => {
      console.log('Example app listening on port ' + port + '!');
    });
  }
}
