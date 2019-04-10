import { Component } from '@angular/core';

import { LoginPopupService } from './login/login-popup/login-popup.service';

@Component({
  selector: 'ptcg-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private loginService: LoginPopupService
  ) { }

  login() {
    this.loginService.openDialog();
  }

}
