import { Request, Response } from 'express';
import { ApiErrorEnum } from '@ptcg/common';
import { Md5 } from '../../utils/md5';
import { RateLimit } from '../common/rate-limit';
import { config } from '../../config';


export function generateToken(userId: number, expire?: number) {
  if (expire === undefined) {
    expire = Math.floor(Date.now() / 1000) + config.backend.tokenExpire;
  }
  const hash = Md5.init(config.backend.secret + userId + expire);
  return `${userId},${expire},${hash}`;
}


export function validateToken(token: string): number {
  if (typeof token !== 'string') {
    return 0;
  }
  const [userId, expire] = token.split(',').map(x => parseInt(x, 10) || 0);
  if (token !== generateToken(userId, expire)) {
    return 0;
  }
  if (expire < Math.floor(Date.now() / 1000)) {
    return 0; // token expired
  }
  return userId;
}


export function AuthToken() {

  const TOKEN_HEADER: string = 'Auth-Token';
  const rateLimit = RateLimit.getInstance();

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const handler = descriptor.value;

    if (handler === undefined) {
      return;
    }

    descriptor.value = function (req: Request, res: Response): any {
      const token = req.header(TOKEN_HEADER) || '';
      const userId = validateToken(token);

      if (rateLimit.isLimitExceeded(req.ip)) {
        res.status(400);
        res.send({error: ApiErrorEnum.REQUESTS_LIMIT_REACHED});
        return;
      }

      if (!userId) {
        rateLimit.increment(req.ip);
        res.statusCode = 403;
        res.send({error: ApiErrorEnum.AUTH_TOKEN_INVALID});
        return;
      }

      Object.assign(req.body, {userId});
      return handler.apply(this, arguments);
    };
  };

}
