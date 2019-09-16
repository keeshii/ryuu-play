import { Request, Response } from 'express';
import { Errors } from '../common/errors';


export function Required(...params: string[]) {

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const handler = descriptor.value;

    if (handler === undefined) {
      return;
    }

    descriptor.value = function (req: Request, res: Response): any {
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        if (!req.body[params[i]]) {
          res.statusCode = 400;
          res.send({error: Errors.REQUIRED_PARAM, param});
          return;
        }
      }
      return handler.apply(this, arguments);
    }
  }

}
