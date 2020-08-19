import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { ApiService } from '../api.service';
import { LoginResponse } from '../interfaces/login.interface';
import { SessionService } from '../../shared/session/session.service';
import { environment } from '../../../environments/environment';
import { ApiError, ApiErrorEnum } from '../api.error';

@Injectable()
export class LoginService {

  constructor(
    private api: ApiService,
    private sessionService: SessionService
  ) {}

  public login(name: string, password: string) {
    return this.api.post<LoginResponse>('/login', { name, password })
      .pipe(map(response => {
        const apiVersion = response.config.apiVersion;
        if (environment.apiVersion !== apiVersion) {
          throw new ApiError(ApiErrorEnum.ERROR_UNSUPPORTED_API_VERSION);
        }
        this.sessionService.set({
          authToken: response.token,
          config: response.config
        });
        return response;
    }));
  }

  public register(name: string, password: string, email: string, code?: string) {
    return this.api.post<LoginResponse>(
      '/login/register', { name, password, email, serverPassword: code });
  }

  public logout() {
    this.sessionService.clear();
  }

}
