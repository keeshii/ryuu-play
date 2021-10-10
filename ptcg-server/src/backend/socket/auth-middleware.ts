import { Socket } from 'socket.io';

import { ApiErrorEnum } from '../common/errors';
import { User } from '../../storage';
import { RateLimit } from '../common/rate-limit';
import { validateToken } from '../services/auth-token';

export async function authMiddleware(socket: Socket, next: (err?: any) => void): Promise<void> {
  const rateLimit = RateLimit.getInstance();
  const token: string = socket.handshake.query && socket.handshake.query.token as string;
  const userId = validateToken(token);
  const ipAddress: string = socket.request.connection.remoteAddress || '0.0.0.0';

  if (rateLimit.isLimitExceeded(ipAddress)) {
    return next(new Error(ApiErrorEnum.REQUESTS_LIMIT_REACHED));
  }

  if (userId === 0) {
    rateLimit.increment(ipAddress);
    return next(new Error(ApiErrorEnum.AUTH_TOKEN_INVALID));
  }

  const user = await User.findOne(userId);
  if (user === undefined) {
    rateLimit.increment(ipAddress);
    return next(new Error(ApiErrorEnum.AUTH_TOKEN_INVALID));
  }

  (socket as any).user = user;
  next();
}
