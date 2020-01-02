import { Request, Response } from 'express';
import { AuthToken } from '../services';
import { Controller, Get } from './controller';
import { Errors } from '../common/errors';
import { User } from '../../storage';


export class Profile extends Controller {

  @Get('/me')
  @AuthToken()
  public async onMe(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const user = await User.findOne(userId);
    if (user === undefined) {
      res.send({error: Errors.PROFILE_INVALID});
      return;
    }
    const profile = {
      name: user.name,
      email: user.email
    };
    res.send({ok: true, user: profile});
  }

}
