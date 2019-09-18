import { Request, Response, NextFunction } from 'express';
import { AuthToken, Validate, check } from '../services';
import { Controller, Get, Post } from './controller';
import { User } from '../../storage';

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  serverPassword: string;
}

export class Login extends Controller {

  @Post('/register')
  @Validate({
    name: check().isName(),
    email: check().isEmail(),
    password: check().minLength(3).maxLength(32)
  })
  public async onRegister(req: Request, res: Response, next: NextFunction) {
    const body: RegisterRequest = req.body;

    const user = new User();
    user.name = body.name;
    user.email = body.email;
    user.password = body.password;

    res.send({ok: true});
  }

  @Get('')
  @AuthToken()
  public async onLogin(req: Request, res: Response) {
    const count = await User.count();
    res.send('Login: ' + count + ' ' + req.body.userId);
  }

  @Get('/logout')
  public onLogout(req: Request, res: Response) {
    res.send('Logout');
  }

}
