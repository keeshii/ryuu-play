import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { LoginResponse } from '../interfaces/login.interface';
import { SessionService } from '../../shared/session/session.service';

@Injectable()
export class LoginService {

  constructor(
    private api: ApiService,
    private sessionService: SessionService
  ) {}

  public login(name: string, password: string) {
    const observable = this.api.post<LoginResponse>(
      '/login', { name, password });

    observable.subscribe(response => {
      this.sessionService.set({authToken: response.token});
      return response;
    }, () => {});
    return observable;
  }

  public register(name: string, password: string, email: string, code?: string) {
    return this.api.post<LoginResponse>(
      '/login/register', { name, password, email, serverPassword: code });
  }

  public logout() {
    this.sessionService.clear();
  }

}
