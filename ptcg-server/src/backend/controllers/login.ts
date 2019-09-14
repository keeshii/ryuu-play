import { Request, Response } from 'express';
import { Controller } from './controller';
import { User } from '../../storage';

export class Login extends Controller {

  public init(): void {
    const base = this.path;

    this.app.get(base, this.onLogin.bind(this));
    this.app.get(`${base}/logout`, this.onLogout.bind(this));
  }

  private async onLogin(req: Request, res: Response) {
    const count = await User.count();
    res.send('Login: ' + count);
  }

  private onLogout(req: Request, res: Response) {
    res.send('Logout');
  }

}
