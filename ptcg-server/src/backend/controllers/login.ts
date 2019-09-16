import { Request, Response, NextFunction } from 'express';
import { AuthToken, Required } from '../services';
import { Controller } from './controller';
import { User } from '../../storage';

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  serverPassword: string;
}

export class Login extends Controller {

  public init(): void {
    const base = this.path;

    this.app.get(base, this.onLogin.bind(this));
    this.app.get(`${base}/logout`, this.onLogout.bind(this));
    this.app.post(`${base}/register`, this.onRegister.bind(this));
  }

  @Required('name', 'email', 'password')
  private async onRegister(req: Request, res: Response, next: NextFunction) {
    const body: RegisterRequest = req.body;

    const user = new User();
    user.name = body.name;
    user.email = body.email;
    user.password = body.password;

    res.send({ok: true});
  }

  @AuthToken()
  private async onLogin(req: Request, res: Response) {
    const count = await User.count();
    res.send('Login: ' + count + ' ' + req.body.userId);
  }

  private onLogout(req: Request, res: Response) {
    res.send('Logout');
  }

}
