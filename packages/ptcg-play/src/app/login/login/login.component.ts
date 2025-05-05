import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';

import { ApiService } from '../../api/api.service';
import { LoginPopupService } from '../login-popup/login-popup.service';
import { LoginRememberService } from '../login-remember.service';
import { LoginService } from 'src/app/api/services/login.service';
import { SocketService } from '../../api/socket.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public loading = false;
  private loginAborted$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private loginPopupService: LoginPopupService,
    private loginRememberService: LoginRememberService,
    private loginService: LoginService,
    private router: Router,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    const apiUrl = this.loginRememberService.apiUrl;
    if (apiUrl && this.apiService.getApiUrl() !== apiUrl) {
      this.apiService.setApiUrl(apiUrl);
      this.socketService.setServerUrl(apiUrl);
    }

    const token = this.loginRememberService.token;
    if (!token) {
      this.loginPopupService.openDialog();
      return;
    }

    this.loading = true;
    this.loginService.tokenLogin(token, this.loginAborted$).pipe(
      untilDestroyed(this),
      finalize(() => { this.loading = false; })
    ).subscribe({
      next: response => {
        this.loginRememberService.rememberToken(response.token);
        const redirectUrl = this.loginPopupService.redirectUrl;
        this.router.navigate([redirectUrl]);
      },
      error: () => {
        this.loginRememberService.rememberToken();
        this.loginPopupService.openDialog();
      }
    });
  }

  ngOnDestroy() {
    this.loginAborted$.next();
    this.loginAborted$.complete();
  }

}
