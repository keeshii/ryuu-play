import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError, ApiErrorEnum } from '../../api/api.error';
import { ResetPasswordService } from '../../api/services/reset-password.service';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  public loading = false;
  public email: string;
  public invalidEmail: string;

  constructor(
    private alertService: AlertService,
    private resetPasswordService: ResetPasswordService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  public sendMail(): void {
    this.loading = true;

    this.resetPasswordService.sendMail(this.email).pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this)
    )
      .subscribe({
        next: async () => {
          await this.alertService.alert('RESET_PASSWORD_EMAIL_SEND_SUCCESS');
          this.router.navigate(['/games']);
        },
        error: (error: ApiError) => {
          this.handleError(error);
        }
      });
  }

  private handleError(error: ApiError) {
    switch (error.code) {
      case ApiErrorEnum.ERROR_LOGIN_INVALID:
        this.invalidEmail = this.email;
        break;

      case ApiErrorEnum.ERROR_EMAIL_EXISTS:
        this.invalidEmail = this.email;
        break;

      default:
        this.alertService.error(error.code || error.message);
        break;
    }
  }

}
