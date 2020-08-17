import { Request, Response } from 'express';
import { AuthToken } from '../services';
import { Controller, Get } from './controller';
import { Errors } from '../common/errors';
import { User, Match } from '../../storage';
import { UserInfo, MatchInfo } from '../interfaces/profile.interface';
import { config } from '../../config';


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
    const userInfo = this.buildUserInfo(user);
    res.send({ok: true, user: userInfo});
  }

  @Get('/get/:id')
  @AuthToken()
  public async onGet(req: Request, res: Response) {
    const userId: number = parseInt(req.params.id, 10);
    const user = await User.findOne(userId);
    if (user === undefined) {
      res.send({error: Errors.PROFILE_INVALID});
      return;
    }
    const userInfo = this.buildUserInfo(user);
    res.send({ok: true, user: userInfo});
  }

  @Get('/matchHistory/:userId/:page?/:pageSize?')
  @AuthToken()
  public async onMatchHistory(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const defaultPageSize = config.backend.defaultPageSize;
    const page: number = parseInt(req.params.page, 10) || 0;
    const pageSize: number = parseInt(req.params.pageSize, 10) || defaultPageSize;

    const [matchRows, total] = await Match.findAndCount({
      relations: ['player1', 'player2'],
      where: [
        { player1: { id: userId } },
        { player2: { id: userId } }
      ],
      skip: page * pageSize,
      take: pageSize
    });

    const matches: MatchInfo[] = matchRows
      .map(match => ({
        matchId: match.id,
        player1: this.buildUserInfo(match.player1),
        player2: this.buildUserInfo(match.player2),
        winner: match.winner,
        rankingStake: match.rankingStake,
        created: match.created
      }));

    res.send({ok: true, matches, total});
  }

  private buildUserInfo(user: User): UserInfo {
    const clientIds = this.core.clients
      .filter(c => c.user.id === user.id)
      .map(c => c.id);

    return {
      clientIds,
      userId: user.id,
      name: user.name,
      email: user.email,
      ranking: user.ranking,
      rank: user.getRank(),
      registered: user.registered,
      lastSeen: user.lastSeen,
      lastRankingChange: user.lastRankingChange,
      avatarFile: user.avatarFile
    };
  }

}
