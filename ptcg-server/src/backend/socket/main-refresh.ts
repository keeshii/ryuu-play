import * as io from 'socket.io';

import { Response } from '../common/websocket';

interface MainRefreshResponse {
  games: number[],
  users: number[]
}

export function mainRefresh(socket: io.Socket, data: string, response: Response<MainRefreshResponse>): void {
  console.log('Received message: ', data);
  response('ok', {
    games: [1, 2, 3],
    users: [4, 5, 6]
  });
}
