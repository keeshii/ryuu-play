import * as io from 'socket.io';

import { Errors } from '../common/errors';
import { User } from '../../storage';
import { validateToken } from '../services/auth-token';

export async function authSocket(socket: io.Socket, next: (err?: any) => void): Promise<void> {
  const token: string = socket.handshake.query && socket.handshake.query.token;
  const userId = validateToken(token);

  if (userId === 0) {
    return next(new Error(Errors.AUTH_TOKEN_INVALID));
  }

  const user = await User.findOne(userId);
  if (user === undefined) {
    return next(new Error(Errors.AUTH_TOKEN_INVALID));
  }

  (socket as any).user = user;
  next();
}
