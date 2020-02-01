import { Component, OnInit } from '@angular/core';

import { LoginPopupService } from '../login-popup/login-popup.service';

@Component({
  selector: 'ptcg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private loginPopupService: LoginPopupService) { }

  ngOnInit() {
    this.loginPopupService.openDialog();
  }

}
