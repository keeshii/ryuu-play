import * as express from 'express';
import * as io from 'socket.io';
import { Websocket, Response } from '../common/websocket';
// import { Storage } from '../../storage/storage';
import { User } from '../../storage/model/user';

export class StorageServer {

  private app: express.Application = express();
  private ws: Websocket = new Websocket();

  constructor(private address: string, private port: number) {

    this.ws.addListener('hello', (socket: io.Socket, user: User, response: Response) => {
      return response('world');
    });

  }

  public async start() {
    const httpServer = this.app.listen(this.port, this.address, () => {
      console.log(`Server listening on ${this.address}:${this.port}.`);
    });

    this.ws.listen(httpServer);
  }

}
