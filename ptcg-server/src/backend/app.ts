import * as express from 'express';

export class App {

  private app: express.Application;

  constructor() {
    this.app = express();
  }

  public start(): void {
    this.app.listen(3000, () => {
      console.log('Example app listening on port 3000!');
    });
  }
}
