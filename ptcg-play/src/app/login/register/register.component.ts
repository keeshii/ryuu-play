import { Component, OnInit } from '@angular/core';
import { ApiErrorEnum } from 'ptcg-server';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';

import { AlertService } from 'src/app/shared/alert/alert.service';
import { ApiError } from 'src/app/api/api.error';
import { LoginService } from 'src/app/api/services/login.service';
import { Router } from '@angular/router';
import { ServerPasswordPopupService } from '../server-password-popup/server-password-popup.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

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
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() { }

  public register(code?: string): void {
    this.loading = true;

    this.loginService.register(this.name, this.password, this.email, code).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    )
      .subscribe(() => {
        this.router.navigate(['/games']);

      }, (error: ApiError) => {
        this.handleError(error);
      });
  }

  private handleError(error: ApiError) {
    switch (error.code) {
      case ApiErrorEnum.REGISTER_DISABLED:
        this.alertService.error(this.translate.instant('ERROR_REGISTRATION_DISABLED'));
        break;

      case ApiErrorEnum.REGISTER_INVALID_SERVER_PASSWORD:
        this.serverPasswordPopupService.openDialog()
          .pipe(untilDestroyed(this))
          .subscribe(code => {
            if (code !== undefined) {
              this.register(code);
            }
          });
        break;

      case ApiErrorEnum.REGISTER_NAME_EXISTS:
        this.invalidName = this.name;
        break;

      case ApiErrorEnum.REGISTER_EMAIL_EXISTS:
        this.invalidEmail = this.email;
        break;
    }
  }

}
