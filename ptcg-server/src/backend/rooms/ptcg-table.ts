import { Room, Client } from "colyseus";
import { IncomingMessage } from "http";
import { validateToken } from '../services/auth-token';

export class PtcgTable extends Room {

  onAuth(client: Client, options: any, request: IncomingMessage) {
    const token: string = options.authToken;
    return validateToken(token) !== 0;
  }

  onMessage (client: Client, message: any) { }

}
