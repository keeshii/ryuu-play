import { Request, Response } from 'express';
import { AuthToken } from '../services';
import { Controller, Get } from './controller';
import { Errors } from '../common/errors';
import { User } from '../../storage';
import { UserInfo } from '../interfaces/profile.interface';


export class Profile extends Controller {

  @Get('/me')
  @AuthToken()
  public async onMe(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const userInfo = await this.getUserInfo(userId);
    if (userInfo === undefined) {
      res.send({error: Errors.PROFILE_INVALID});
      return;
    }
    res.send({ok: true, user: userInfo});
  }

  @Get('/get/:id')
  @AuthToken()
  public async onGet(req: Request, res: Response) {
    const userId: number = parseInt(req.params.id, 10);
    const userInfo = await this.getUserInfo(userId);
    if (userInfo === undefined) {
      res.send({error: Errors.PROFILE_INVALID});
      return;
    }
    res.send({ok: true, user: userInfo});
  }

  private async getUserInfo(userId: number): Promise<UserInfo | undefined> {
    const user = await User.findOne(userId);
    if (user === undefined) {
      return;
    }
    const clientIds = this.core.clients
      .filter(c => c.user.id === user.id)
      .map(c => c.id);

    return {
      clientIds,
      userId: user.id,
      name: user.name,
      email: user.email,
      ranking: user.ranking,
      rank: user.rank,
      avatarFile: user.avatarFile
    };
  }

}
