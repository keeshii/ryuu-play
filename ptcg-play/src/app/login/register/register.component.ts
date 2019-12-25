import { Component, OnInit, OnDestroy } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AlertService } from 'src/app/shared/alert/alert.service';
import { ApiError, ApiErrorEnum } from 'src/app/api/api.error';
import { LoginService } from 'src/app/api/services/login.service';
import { Router } from '@angular/router';
import { ServerPasswordPopupService } from '../server-password-popup/server-password-popup.service';
import { takeUntilDestroyed } from 'src/app/shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  public loading = false;
  public name: string;
  public email: string;
  public password: string;
  public confirmPassword: string;
  public invalidName: string;
  public invalidEmail: string;

  constructor(
    private alertService: AlertService,
    private loginService: LoginService,
    private serverPasswordPopupService: ServerPasswordPopupService,
    private router: Router
  ) { }

  ngOnInit() { }

  ngOnDestroy() { }

  public register(code?: string): void {
    this.loading = true;

    this.loginService.register(this.name, this.password, this.email, code).pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this)
    )
      .subscribe(() => {
        this.router.navigate(['/games']);

      }, (error: ApiError) => {
        this.handleError(error);
      });
  }

  private handleError(error: ApiError) {
    switch (error.code) {
      case ApiErrorEnum.ERROR_REGISTER_DISABLED:
        this.alertService.error('ERROR_REGISTER_DISABLED');
        break;
      case ApiErrorEnum.ERROR_REGISTER_INVALID_SERVER_PASSWORD:
        this.serverPasswordPopupService.openDialog()
          .pipe(takeUntilDestroyed(this))
          .subscribe(code => {
            if (code !== undefined) {
              this.register(code);
            }
          });
        break;

      case ApiErrorEnum.ERROR_NAME_EXISTS:
        this.invalidName = this.name;
        break;

      case ApiErrorEnum.ERROR_EMAIL_EXISTS:
        this.invalidEmail = this.email;
        break;

      default:
        this.alertService.error('INVALID_SERVER_RESPONSE');
        break;
    }
  }

}
