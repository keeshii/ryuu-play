import { Component } from '@angular/core';
import { ApiErrorEnum } from 'ptcg-server';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { ResetPasswordService } from '../../api/services/reset-password.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {

  public loading = false;
  public email: string;
  public invalidEmail: string;

  constructor(
    private alertService: AlertService,
    private resetPasswordService: ResetPasswordService,
    private router: Router,
    private translate: TranslateService
  ) { }

  public sendMail(): void {
    this.loading = true;

    this.resetPasswordService.sendMail(this.email).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    )
      .subscribe({
        next: async () => {
          await this.alertService.alert(this.translate.instant('RESET_PASSWORD_SUCCESS'));
          this.router.navigate(['/games']);
        },
        error: (error: ApiError) => {
          this.handleError(error);
        }
      });
  }

  private handleError(error: ApiError) {
    switch (error.code) {
      case ApiErrorEnum.LOGIN_INVALID:
        this.invalidEmail = this.email;
        break;

      case ApiErrorEnum.CANNOT_SEND_MESSAGE:
        this.alertService.error('RESET_PASSWORD_CANNOT_SEND_EMAIL');
        break;
    }
  }

}
