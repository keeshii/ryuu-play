import { Request, Response } from 'express';

import { AuthToken } from '../services';
import { Controller, Get } from './controller';
import { RankingInfo } from '../interfaces';
import { User } from '../../storage';
import { config } from '../../config';

export class Ranking extends Controller {

  @Get('/list/:page?/:pageSize?')
  @AuthToken()
  public async onList(req: Request, res: Response) {
    const defaultPageSize = config.backend.defaultPageSize;
    const page: number = parseInt(req.params.page, 10) || 0;
    const pageSize: number = parseInt(req.params.pageSize, 10) || defaultPageSize;

    const [users, total] = await User.findAndCount({
      order: { ranking: "DESC", lastRankingChange: "DESC", registered: "ASC" },
      skip: page * pageSize,
      take: pageSize
    });

    let position = page * pageSize;
    const ranking: RankingInfo[] = users.map(user => {
      position += 1;
      return {
        position,
        user: this.buildUserInfo(user)
      }
    });

    res.send({ok: true, ranking, total});
  }

}
