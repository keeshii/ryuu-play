import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { Response } from '../interfaces/response.interface';

@Injectable()
export class ResetPasswordService {

  constructor(
    private api: ApiService,
  ) {}

  public sendMail(email: string) {
    return this.api.post<Response>('/v1/resetPassword/sendMail', { email });
  }

  public changePassword(token: string, newPassword: string) {
    return this.api.post<Response>('/v1/resetPassword/changePassword', { token, newPassword });
  }

}
