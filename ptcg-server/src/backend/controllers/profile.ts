import { Request, Response } from 'express';
import { FindConditions } from 'typeorm';

import { AuthToken, Validate, check } from '../services';
import { Controller, Get, Post } from './controller';
import { ApiErrorEnum } from '../common/errors';
import { MatchInfo } from '../interfaces/profile.interface';
import { Md5 } from '../../utils/md5';
import { User, Match } from '../../storage';
import { UserInfo } from '../interfaces/core.interface';
import { config } from '../../config';


export class Profile extends Controller {

  @Get('/me')
  @AuthToken()
  public async onMe(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const user = await User.findOne(userId);
    if (user === undefined) {
      res.send({error: ApiErrorEnum.PROFILE_INVALID});
      return;
    }
    const userInfo = this.buildUserInfo(user);
    res.send({ok: true, user: userInfo});
  }

  @Get('/get/:id')
  @AuthToken()
  public async onGet(req: Request, res: Response) {
    const userId: number = parseInt(req.params.id, 10);
    const user = await User.findOne(userId);
    if (user === undefined) {
      res.send({error: ApiErrorEnum.PROFILE_INVALID});
      return;
    }
    const userInfo = this.buildUserInfo(user);
    res.send({ok: true, user: userInfo});
  }

  @Get('/matchHistory/:userId/:page?/:pageSize?')
  @AuthToken()
  public async onMatchHistory(req: Request, res: Response) {
    const defaultPageSize = config.backend.defaultPageSize;
    const userId: number = parseInt(req.params.userId, 10) || 0;
    const page: number = parseInt(req.params.page, 10) || 0;
    const pageSize: number = parseInt(req.params.pageSize, 10) || defaultPageSize;

    const where: FindConditions<Match>[] = userId === 0 ? []
      : [ { player1: { id: userId } }, { player2: { id: userId } } ];

    const [matchRows, total] = await Match.findAndCount({
      relations: ['player1', 'player2'],
      where,
      order: { created: 'DESC' },
      skip: page * pageSize,
      take: pageSize
    });

    const users: UserInfo[] = [];
    matchRows.forEach(match => {
      [match.player1, match.player2].forEach(player => {
        if (!users.some(u => u.userId === player.id)) {
          users.push(this.buildUserInfo(player));
        }
      });
    });

    const matches: MatchInfo[] = matchRows
      .map(match => ({
        matchId: match.id,
        player1Id: match.player1.id,
        player2Id: match.player2.id,
        ranking1: match.ranking1,
        rankingStake1: match.rankingStake1,
        ranking2: match.ranking2,
        rankingStake2: match.rankingStake2,
        winner: match.winner,
        created: match.created
      }));

    res.send({ok: true, matches, users, total});
  }

  @Post('/changePassword')
  @AuthToken()
  @Validate({
    currentPassword: check().isPassword(),
    newPassword: check().isPassword()
  })
  public async onChangePassword(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const body: { currentPassword: string, newPassword: string } = req.body;
    const user = await User.findOne(userId);

    if (user === undefined || user.password !== Md5.init(body.currentPassword)) {
      res.status(400);
      res.send({error: ApiErrorEnum.LOGIN_INVALID});
      return;
    }

    user.password = Md5.init(body.newPassword);
    try {
      await user.save();
    } catch (error) {
      res.status(400);
      res.send({error: ApiErrorEnum.LOGIN_INVALID});
      return;
    }

    res.send({ ok: true });
  }

  @Post('/changeEmail')
  @AuthToken()
  @Validate({
    email: check().isEmail(),
  })
  public async onChangeEmail(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const body: { email: string } = req.body;
    const user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({error: ApiErrorEnum.LOGIN_INVALID});
      return;
    }

    if (user.email === body.email) {
      res.send({ ok: true });
      return;
    }

    if (await User.findOne({email: body.email})) {
      res.status(400);
      res.send({error: ApiErrorEnum.REGISTER_EMAIL_EXISTS});
      return;
    }

    try {
      user.email = body.email;
      await user.save();
    } catch (error) {
      res.status(400);
      res.send({error: ApiErrorEnum.LOGIN_INVALID});
      return;
    }

    res.send({ ok: true });
  }

}
