import { Request, Response, NextFunction, RequestHandler } from 'express';

export function cors(): RequestHandler {
  return function(req: Request, res: Response, next: NextFunction): any {
    const allowedHeaders = [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Auth-Token'
    ];

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header('Access-Control-Allow-Headers', allowedHeaders.join(','));

    next();
  }
}
