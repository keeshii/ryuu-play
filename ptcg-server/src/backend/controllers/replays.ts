import { Request, Response } from 'express';

import { AuthToken } from '../services';
import { Controller, Get } from './controller';
import { Errors } from '../common/errors';
import { Match } from '../../storage';
import { Base64 } from '../../utils';

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

    const base64 = new Base64();
    const replayData = base64.encode(Buffer.from(entity.replayData).toString());
    res.send({ok: true, replayData});
  }

}
