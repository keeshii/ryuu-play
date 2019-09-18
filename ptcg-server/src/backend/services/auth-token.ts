import { Request, Response } from 'express';
import { Errors } from '../common/errors';
import { Md5 } from '../common/md5';
import { config } from '../../utils';


export function generateToken(userId: number, expire?: number) {
  if (expire === undefined) {
    expire = Math.floor(Date.now() / 1000) + config.backend.tokenExpire;
  }
  const hash = Md5.init(config.backend.secret + userId + expire);
  return `${userId},${expire},${hash}`;
}


export function validateToken(token: string): number {
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

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const handler = descriptor.value;

    if (handler === undefined) {
      return;
    }

    descriptor.value = function (req: Request, res: Response): any {
      const token = req.header(TOKEN_HEADER) || '';
      const userId = validateToken(token);

      if (!userId) {
        res.statusCode = 403;
        res.send({error: Errors.AUTH_TOKEN_INVALID});
        return;
      }

      Object.assign(req.body, {userId});
      return handler.apply(this, arguments);
    }
  }

}
