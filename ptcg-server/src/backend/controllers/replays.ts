import { Request, Response } from 'express';
import { In } from 'typeorm/find-options/operator/In';

import { AuthToken } from '../services';
import { Controller, Get } from './controller';
import { Errors } from '../common/errors';
import { UserInfo } from '../interfaces/core.interface';
import { Match, User, Replay } from '../../storage';
import { ReplayInfo } from '../interfaces/replay.interface';
import { Base64 } from '../../utils';
import { config } from '../../config';

export class Replays extends Controller {

  @Get('/list/:page?/:pageSize?')
  @AuthToken()
  public async onList(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const defaultPageSize = config.backend.defaultPageSize;
    const page: number = parseInt(req.params.page, 10) || 0;
    const pageSize: number = parseInt(req.params.pageSize, 10) || defaultPageSize;
    const [replayRows, total] = await Replay.findAndCount({
      where: [
        { user: { id: userId } }
      ],
      order: { created: "DESC" },
      skip: page * pageSize,
      take: pageSize
    });

    const userIds: number[] = [];
    replayRows.forEach(replay => {
      for (const id of [replay.player1.userId, replay.player2.userId]) {
        if (id !== 0 && !userIds.includes(id)) {
          userIds.push(id);
        }
      }
    });

    const users: UserInfo[] = [];
    if (userIds.length > 0) {
      const userRows = await User.find({
        where: { id: In(userIds) }
      });
      userRows.forEach(user => {
        users.push(this.buildUserInfo(user));
      });
    }

    const replays: ReplayInfo[] = replayRows
      .map(replay => ({
        replayId: replay.id,
        name: replay.name,
        player1: replay.player1,
        player2: replay.player2,
        winner: replay.winner,
        created: replay.created
      }));

    res.send({ok: true, replays, users, total});
  }

  @Get('/match/:id')
  @AuthToken()
  public async onGet(req: Request, res: Response) {
    const matchId: number = parseInt(req.params.id, 10);
    const entity = await Match.findOne(matchId);

    if (entity === undefined) {
      res.send({error: Errors.GAME_INVALID_ID});
      return;
    }

    const base64 = new Base64();
    const replayData = base64.encode(Buffer.from(entity.replayData).toString());
    res.send({ok: true, replayData});
  }

}
