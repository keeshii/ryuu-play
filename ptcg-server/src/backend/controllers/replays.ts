import { Request, Response } from 'express';

import { AuthToken } from '../services';
import { Controller, Get } from './controller';
import { Errors } from '../common/errors';
import { Match } from '../../storage';

export class Replays extends Controller {

  @Get('/match/:id')
  @AuthToken()
  public async onGet(req: Request, res: Response) {
    const matchId: number = parseInt(req.params.id, 10);
    const entity = await Match.findOne(matchId);

    if (entity === undefined) {
      res.send({error: Errors.GAME_INVALID_ID});
      return;
    }

    const replayData = entity.replayData.toString();
    res.send({ok: true, replayData});
  }


}
