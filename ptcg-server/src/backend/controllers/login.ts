import { Request, Response, NextFunction } from 'express';
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

  private async onRegister(req: Request, res: Response, next: NextFunction) {
    const body: RegisterRequest = req.body;

    console.log(body);

    if (!body.name || !body.email || !body.password) {
      res.statusCode = 400;
      return next(new Error('Invalid params'));
    }

    console.log(req.body);
    res.send({ok: true});
  }

  private async onLogin(req: Request, res: Response) {
    const count = await User.count();
    res.send('Login: ' + count);
  }

  private onLogout(req: Request, res: Response) {
    res.send('Logout');
  }

}
