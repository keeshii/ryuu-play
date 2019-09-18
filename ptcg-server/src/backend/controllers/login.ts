import { Request, Response, NextFunction } from 'express';
import { AuthToken, Validate, check, generateToken } from '../services';
import { Controller, Get, Post } from './controller';
import { Errors } from '../common/errors';
import { LoginRequest, RegisterRequest } from '../interfaces';
import { Md5 } from '../common/md5';
import { User } from '../../storage';
import { config } from '../../utils';


export class Login extends Controller {

  @Post('/register')
  @Validate({
    name: check().isName(),
    email: check().isEmail(),
    password: check().minLength(3).maxLength(32)
  })
  public async onRegister(req: Request, res: Response, next: NextFunction) {
    const body: RegisterRequest = req.body;

    if (config.backend.registrationEnabled === false) {
      res.status(400);
      res.send({error: Errors.REGISTER_DISABLED});
      return;
    }

    if (config.backend.serverPassword
      && config.backend.serverPassword !== body.serverPassword
    ) {
      res.status(400);
      res.send({error: Errors.REGISTER_INVALID_SERVER_PASSWORD});
      return;
    }

    if (await User.findOne({name: body.name})) {
      res.status(400);
      res.send({error: Errors.REGISTER_NAME_EXISTS});
      return;
    }

    if (await User.findOne({email: body.email})) {
      res.status(400);
      res.send({error: Errors.REGISTER_EMAIL_EXISTS});
      return;
    }

    const user = new User();
    user.name = body.name;
    user.email = body.email;
    user.password = Md5.init(body.password);
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

    if (user === undefined || user.password !== Md5.init(body.password)) {
      res.status(400);
      res.send({error: Errors.LOGIN_INVALID});
      return;
    }

    const token = generateToken(user.id);
    res.send({ok: true, token});
  }

  @Get('/refreshToken')
  @AuthToken()
  public async onRefreshToken(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const token = generateToken(userId);
    res.send({ok: true, token});
  }

  @Get('/logout')
  @AuthToken()
  public onLogout(req: Request, res: Response) {
    res.send({ok: true});
  }

}
