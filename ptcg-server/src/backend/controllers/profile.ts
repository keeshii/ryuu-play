import { Request, Response } from 'express';
import { AuthToken } from '../services';
import { Controller, Get } from './controller';
import { Errors } from '../common/errors';
import { User, Match } from '../../storage';
import { MatchInfo } from '../interfaces/profile.interface';
import { UserInfo } from '../interfaces/core.interface';
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
      order: { created: "DESC" },
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

  private buildUserInfo(user: User): UserInfo {
    const connected = this.core.clients
      .some(c => c.user.id === user.id);

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      ranking: user.ranking,
      rank: user.getRank(),
      registered: user.registered,
      lastSeen: user.lastSeen,
      lastRankingChange: user.lastRankingChange,
      avatarFile: user.avatarFile,
      connected
    };
  }

}
