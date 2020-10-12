import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginRememberService {

  public token: string;
  public apiUrl: string;

  constructor() {
    this.token = window.localStorage.getItem('token');
    this.apiUrl = window.localStorage.getItem('apiUrl');
  }

  public rememberApiUrl(apiUrl?: string) {
    this.apiUrl = apiUrl;
    if (apiUrl === undefined) {
      window.localStorage.removeItem('apiUrl');
      return;
    }
    window.localStorage.setItem('apiUrl', apiUrl);
  }

  public rememberToken(token?: string) {
    this.token = token;
    if (token === undefined) {
      window.localStorage.removeItem('token');
      return;
    }
    window.localStorage.setItem('token', token);
  }

}
