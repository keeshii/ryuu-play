import { Request, Response } from 'express';
import { Validate, check } from '../services';
import { Controller, Post } from './controller';
import { ApiErrorEnum } from '@ptcg/common';
import { Mailer, resetPasswordTemplates } from '../../email';
import { Md5 } from '../../utils/md5';
import { User } from '../../storage';
import { RateLimit } from '../common/rate-limit';
import { config } from '../../config';

interface OneTimeToken {
  userId: number;
  expire: number;
  hash: string;
}

export class ResetPassword extends Controller {

  private rateLimit = RateLimit.getInstance();
  private mailer = new Mailer();
  private tokens: OneTimeToken[] = [];

  @Post('/sendMail')
  @Validate({
    email: check().isEmail(),
  })
  public async onSendMail(req: Request, res: Response) {
    const body: { email: string, language?: string } = req.body;

    if (this.rateLimit.isLimitExceeded(req.ip)) {
      res.status(400);
      res.send({error: ApiErrorEnum.REQUESTS_LIMIT_REACHED});
      return;
    }

    // Don't allow to create to many reset-password requests
    this.rateLimit.increment(req.ip);

    const user = await User.findOne({ where: {email: body.email} });

    if (user === null) {
      res.status(400);
      res.send({error: ApiErrorEnum.LOGIN_INVALID});
      return;
    }

    const token = this.generateToken(user.id);
    const language = body.language ? String(body.language) : 'en';
    const template = resetPasswordTemplates[language] || resetPasswordTemplates['en'];
    const params = {
      appName: config.email.appName,
      publicAddress: config.email.publicAddress,
      token
    };

    try {
      await this.mailer.sendEmail(body.email, template, params);
    } catch (error) {
      res.status(400);
      res.send({error: ApiErrorEnum.CANNOT_SEND_MESSAGE});
      return;
    }

    res.send({ok: true});
  }

  @Post('/changePassword')
  @Validate({
    token: check().isString().required(),
    newPassword: check().minLength(3).maxLength(32)
  })
  public async onChangePassword(req: Request, res: Response) {
    const body: { token: string, newPassword: string } = req.body;

    const token = this.validateToken(body.token);
    if (token === undefined) {
      res.status(400);
      res.send({error: ApiErrorEnum.LOGIN_INVALID});
      return;
    }

    const userId = token.userId;
    const user = await User.findOneById(userId);

    if (user === null) {
      res.status(400);
      res.send({error: ApiErrorEnum.LOGIN_INVALID});
      return;
    }

    user.password = Md5.init(body.newPassword);
    try {
      await user.save();
    } catch (error) {
      res.status(400);
      res.send({error: ApiErrorEnum.LOGIN_INVALID});
      return;
    }

    res.send({ ok: true });
  }

  private generateToken(userId: number): string {
    const now = Math.floor(Date.now() / 1000);
    this.tokens = this.tokens.filter(t => t.expire >= now);

    const random = Math.round(10000 * Math.random());
    const expire = now + config.backend.tokenExpire;
    const md5 = Md5.init(config.backend.secret + random);
    const hash = `${userId},${md5}`;

    this.tokens.push({ userId, expire, hash });
    return hash;
  }

  private validateToken(hash: string): OneTimeToken | undefined {
    if (typeof hash !== 'string') {
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    this.tokens = this.tokens.filter(t => t.expire >= now);

    const index = this.tokens.findIndex(t => t.hash === hash);
    if (index !== -1) {
      const token = this.tokens[index];
      this.tokens.splice(index, 1);
      return token;
    }
  }

}
