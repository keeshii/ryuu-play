import { Request, Response } from 'express';
import { AuthToken } from '../services';
import { Controller, Get } from './controller';
import { ApiErrorEnum } from '../common/errors';


export class Game extends Controller {

  @Get('/:id/logs')
  @AuthToken()
  public async onLogs(req: Request, res: Response) {
    const gameId: number = parseInt(req.params.id, 10);
    const game = this.core.games.find(g => g.id === gameId);
    if (game === undefined) {
      res.send({error: ApiErrorEnum.GAME_INVALID_ID});
      return;
    }
    const logs = game.state.logs;
    res.send({ok: true, logs });
  }

  @Get('/:id/playerStats')
  @AuthToken()
  public async onPlayerStats(req: Request, res: Response) {
    const gameId: number = parseInt(req.params.id, 10);
    const game = this.core.games.find(g => g.id === gameId);
    if (game === undefined) {
      res.send({error: ApiErrorEnum.GAME_INVALID_ID});
      return;
    }
    const playerStats = game.playerStats;
    res.send({ok: true, playerStats });
  }

}
