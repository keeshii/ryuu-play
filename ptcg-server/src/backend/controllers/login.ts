import { Request, Response, NextFunction } from 'express';
import { AuthToken, Validate, check, generateToken } from '../services';
import { Controller, Get, Post } from './controller';
import { ApiErrorEnum } from '../common/errors';
import { LoginRequest, RegisterRequest, ServerConfig } from '../interfaces';
import { Md5 } from '../../utils/md5';
import { User } from '../../storage';
import { RateLimit } from '../common/rate-limit';
import { config } from '../../config';


export class Login extends Controller {

  private rateLimit = RateLimit.getInstance();

  @Post('/register')
  @Validate({
    name: check().isName(),
    email: check().isEmail(),
    password: check().isPassword()
  })
  public async onRegister(req: Request, res: Response, next: NextFunction) {
    const body: RegisterRequest = req.body;

    if (config.backend.registrationEnabled === false) {
      res.status(400);
      res.send({error: ApiErrorEnum.REGISTER_DISABLED});
      return;
    }

    if (this.rateLimit.isLimitExceeded(req.ip)) {
      res.status(400);
      res.send({error: ApiErrorEnum.REQUESTS_LIMIT_REACHED});
      return;
    }

    if (config.backend.serverPassword
      && config.backend.serverPassword !== body.serverPassword
    ) {
      this.rateLimit.increment(req.ip);
      res.status(400);
      res.send({error: ApiErrorEnum.REGISTER_INVALID_SERVER_PASSWORD});
      return;
    }

    if (await User.findOne({name: body.name})) {
      res.status(400);
      res.send({error: ApiErrorEnum.REGISTER_NAME_EXISTS});
      return;
    }

    if (await User.findOne({email: body.email})) {
      res.status(400);
      res.send({error: ApiErrorEnum.REGISTER_EMAIL_EXISTS});
      return;
    }

    // Don't allow to create to many users
    this.rateLimit.increment(req.ip);

    const user = new User();
    user.name = body.name;
    user.email = body.email;
    user.password = Md5.init(body.password);
    user.registered = Date.now();
    await user.save();

    res.send({ok: true});
  }

  @Post('')
  @Validate({
    name: check().isName(),
    password: check().isString()
  })
  public async onLogin(req: Request, res: Response) {
    const body: LoginRequest = req.body;
    const user = await User.findOne({name: body.name});

    if (this.rateLimit.isLimitExceeded(req.ip)) {
      res.status(400);
      res.send({error: ApiErrorEnum.REQUESTS_LIMIT_REACHED});
      return;
    }

    if (user === undefined || user.password !== Md5.init(body.password)) {
      this.rateLimit.increment(req.ip);
      res.status(400);
      res.send({error: ApiErrorEnum.LOGIN_INVALID});
      return;
    }

    const token = generateToken(user.id);
    res.send({ok: true, token, config: this.getServerConfig()});
  }

  @Get('/refreshToken')
  @AuthToken()
  public async onRefreshToken(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const token = generateToken(userId);
    res.send({ok: true, token, config: this.getServerConfig()});
  }

  @Get('/logout')
  @AuthToken()
  public onLogout(req: Request, res: Response) {
    res.send({ok: true});
  }

  @Get('/info')
  public onInfo(req: Request, res: Response) {
    res.send({ok: true, config: this.getServerConfig()});
  }

  private getServerConfig(): ServerConfig {
    return {
      apiVersion: 2,
      defaultPageSize: config.backend.defaultPageSize,
      scansUrl: config.sets.scansUrl,
      avatarsUrl: config.backend.avatarsUrl,
      avatarFileSize: config.backend.avatarFileSize,
      avatarMinSize: config.backend.avatarMinSize,
      avatarMaxSize: config.backend.avatarMaxSize,
      replayFileSize: config.backend.replayFileSize
    };
  }

}
