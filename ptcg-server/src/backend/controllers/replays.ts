import { Request, Response } from 'express';
import { Like, In } from 'typeorm';

import { AuthToken, Validate, check } from '../services';
import { Controller, Get, Post } from './controller';
import { ApiErrorEnum } from '../common/errors';
import { Match, User, Replay } from '../../storage';
import { Replay as GameReplay, ReplayPlayer } from '../../game';
import { ReplayInfo, ReplayImport } from '../interfaces/replay.interface';
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
      order: { created: 'DESC', name: 'ASC' },
      skip: page * pageSize,
      take: pageSize
    });

    const userMap = await this.buildUserMap(replayRows);

    const replays: ReplayInfo[] = replayRows
      .map(replay => this.buildReplayInfo(replay, userMap));

    res.send({ok: true, replays, total});
  }

  @Post('/list/:page?/:pageSize?')
  @AuthToken()
  @Validate({
    query: check().isString().required()
  })
  public async onFind(req: Request, res: Response) {
    const body: { query: string } = req.body;
    const userId: number = req.body.userId;
    const defaultPageSize = config.backend.defaultPageSize;
    const page: number = parseInt(req.params.page, 10) || 0;
    const pageSize: number = parseInt(req.params.pageSize, 10) || defaultPageSize;
    const query: string = (body.query || '').trim();

    if (query === '') {
      return this.onList(req, res);
    }

    const escapedQuery = this.escapeLikeString(query);

    const [replayRows, total] = await Replay.findAndCount({
      where: { name: Like(`%${escapedQuery}%`), user: { id: userId } },
      order: { created: 'DESC', name: 'ASC' },
      skip: page * pageSize,
      take: pageSize
    });

    const userMap = await this.buildUserMap(replayRows);

    const replays: ReplayInfo[] = replayRows
      .map(replay => this.buildReplayInfo(replay, userMap));

    res.send({ok: true, replays, total});
  }

  @Get('/match/:id')
  @AuthToken()
  public async onMatchGet(req: Request, res: Response) {
    const matchId: number = parseInt(req.params.id, 10);
    const entity = await Match.findOne(matchId);

    if (entity === undefined) {
      res.send({error: ApiErrorEnum.GAME_INVALID_ID});
      return;
    }

    const base64 = new Base64();
    const replayData = base64.encode(entity.replayData);
    res.send({ok: true, replayData});
  }

  @Get('/get/:id')
  @AuthToken()
  public async onGet(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const replayId: number = parseInt(req.params.id, 10);
    const entity = await Replay.findOne(replayId, { relations: ['user'] });

    if (entity === undefined || entity.user.id !== userId) {
      res.send({error: ApiErrorEnum.REPLAY_INVALID});
      return;
    }

    const base64 = new Base64();
    const replayData = base64.encode(entity.replayData);
    res.send({ok: true, replayData});
  }

  @Post('/save')
  @AuthToken()
  @Validate({
    name: check().minLength(3).maxLength(32),
    id: check().isNumber()
  })
  public async onSave(req: Request, res: Response) {
    const body: { id: number, name: string } = req.body;

    const userId: number = req.body.userId;
    const user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({error: ApiErrorEnum.PROFILE_INVALID});
      return;
    }

    const match = await Match.findOne(body.id);
    if (match === undefined) {
      res.status(400);
      res.send({error: ApiErrorEnum.GAME_INVALID_ID});
      return;
    }

    const gameReplay = new GameReplay({ indexEnabled: false });
    try {
      gameReplay.deserialize(match.replayData);
    } catch (error) {
      res.status(400);
      res.send({error: ApiErrorEnum.REPLAY_INVALID});
      return;
    }

    let replay = new Replay();
    replay.user = user;
    replay.name = body.name.trim();
    replay.player1 = gameReplay.player1;
    replay.player2 = gameReplay.player2;
    replay.winner = gameReplay.winner;
    replay.created = gameReplay.created;
    replay.replayData = match.replayData;

    try {
      replay = await replay.save();
    } catch (error) {
      res.status(400);
      res.send({error: ApiErrorEnum.REPLAY_INVALID});
      return;
    }

    const userMap = await this.buildUserMap([replay]);
    const replayInfo = this.buildReplayInfo(replay, userMap);

    res.send({ok: true, replay: replayInfo});
  }

  @Post('/delete')
  @AuthToken()
  @Validate({
    id: check().isNumber()
  })
  public async onDelete(req: Request, res: Response) {
    const body: { id: number } = req.body;

    const userId: number = req.body.userId;
    const user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({error: ApiErrorEnum.PROFILE_INVALID});
      return;
    }

    const replay = await Replay.findOne(body.id, { relations: ['user'] });

    if (replay === undefined || replay.user.id !== user.id) {
      res.status(400);
      res.send({error: ApiErrorEnum.REPLAY_INVALID});
      return;
    }

    await replay.remove();

    res.send({ok: true});
  }

  @Post('/rename')
  @AuthToken()
  @Validate({
    id: check().isNumber(),
    name: check().minLength(3).maxLength(32),
  })
  public async onRename(req: Request, res: Response) {
    const body: { id: number, name: string } = req.body;

    const userId: number = req.body.userId;
    const user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({error: ApiErrorEnum.PROFILE_INVALID});
      return;
    }

    let replay = await Replay.findOne(body.id, { relations: ['user'] });

    if (replay === undefined || replay.user.id !== user.id) {
      res.status(400);
      res.send({error: ApiErrorEnum.REPLAY_INVALID});
      return;
    }

    try {
      replay.name = body.name.trim();
      replay = await replay.save();
    } catch (error) {
      res.status(400);
      res.send({error: ApiErrorEnum.REPLAY_INVALID});
      return;
    }

    res.send({ok: true, replay: {
      id: replay.id,
      name: replay.name
    }});
  }

  @Post('/import')
  @AuthToken()
  @Validate({
    name: check().minLength(3).maxLength(32),
    replayData: check().isString().required(),
  })
  public async onImport(req: Request, res: Response) {
    const body: ReplayImport = req.body;

    const userId: number = req.body.userId;
    const user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({error: ApiErrorEnum.PROFILE_INVALID});
      return;
    }

    const base64 = new Base64();
    const gameReplay = new GameReplay({ indexEnabled: false });

    try {
      const replayData = base64.decode(body.replayData);
      gameReplay.deserialize(replayData);

      gameReplay.player1 = await this.syncReplayPlayer(gameReplay.player1);
      gameReplay.player2 = await this.syncReplayPlayer(gameReplay.player2);
      gameReplay.created = Date.now();
    } catch (error) {
      res.status(400);
      res.send({error: ApiErrorEnum.REPLAY_INVALID});
      return;
    }

    let replay = new Replay();
    replay.user = user;
    replay.name = body.name.trim();
    replay.player1 = gameReplay.player1;
    replay.player2 = gameReplay.player2;
    replay.winner = gameReplay.winner;
    replay.created = gameReplay.created;

    try {
      replay.replayData = gameReplay.serialize();
      replay = await replay.save();
    } catch (error) {
      res.status(400);
      res.send({error: ApiErrorEnum.REPLAY_INVALID});
      return;
    }

    const userMap = await this.buildUserMap([replay]);
    const replayInfo = this.buildReplayInfo(replay, userMap);

    res.send({ok: true, replay: replayInfo});
  }

  private async syncReplayPlayer(player: ReplayPlayer): Promise<ReplayPlayer> {
    const name = String(player.name);
    const ranking = parseInt(String(player.ranking), 10);
    const userId = 0;

    const userRows = await User.find({ where: { name: player.name } });
    if (userRows.length > 0) {
      const user = userRows[0];
      return {
        userId: user.id,
        name: user.name,
        ranking: user.ranking
      };
    }

    return { userId, name, ranking };
  }

  private async buildUserMap(replays: Replay[]): Promise<{[id: number]: User}> {
    const userIds: number[] = [];
    replays.forEach(replay => {
      for (const id of [replay.player1.userId, replay.player2.userId]) {
        if (id !== undefined && !userIds.includes(id)) {
          userIds.push(id);
        }
      }
    });

    const userMap: {[id: number]: User} = {};
    if (userIds.length > 0) {
      const userRows = await User.find({
        where: { id: In(userIds) }
      });
      userRows.forEach(user => {
        userMap[user.id] = user;
      });
    }
    return userMap;
  }

  private buildReplayInfo(replay: Replay, userMap: {[id: number]: User}): ReplayInfo {
    let user1 = userMap[replay.player1.userId];
    let user2 = userMap[replay.player2.userId];

    if (user1 === undefined) {
      user1 = new User();
      user1.name = replay.player1.name;
      user1.ranking = replay.player1.ranking;
    }

    if (user2 === undefined) {
      user2 = new User();
      user2.name = replay.player2.name;
      user2.ranking = replay.player2.ranking;
    }

    return {
      replayId: replay.id,
      name: replay.name,
      player1: this.buildUserInfo(user1),
      player2: this.buildUserInfo(user2),
      winner: replay.winner,
      created: replay.created
    };
  }

}
