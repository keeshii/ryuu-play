import { Component } from '@angular/core';

import { LoginService } from './dialog/login-popup/login.service';

@Component({
  selector: 'ptcg-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private loginService: LoginService
  ) { }

  login() {
    this.loginService.openDialog();
  }

}
