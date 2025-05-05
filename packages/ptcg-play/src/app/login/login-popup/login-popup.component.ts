import { Component, OnDestroy, Inject } from '@angular/core';
import { ApiErrorEnum } from '@ryuu-play/ptcg-server';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { ChangeServerPopupComponent } from '../change-server-popup/change-server-popup.component';
import { LoginService } from '../../api/services/login.service';
import { LoginRememberService } from '../login-remember.service';
import { environment } from '../../../environments/environment';

@UntilDestroy()
@Component({
  selector: 'ptcg-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss']
})
export class LoginPopupComponent implements OnDestroy {

  public loading = false;
  public name: string;
  public password: string;
  public rememberMe = true;
  public allowServerChange = environment.allowServerChange;
  private loginAborted$ = new Subject<void>();

  constructor(
    private alertService: AlertService,
    private loginService: LoginService,
    private loginRememberService: LoginRememberService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<LoginPopupComponent>,
    private router: Router,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) private data: { redirectUrl: string },
  ) { }

  login() {
    this.loading = true;
    this.loginService.login(this.name, this.password, this.loginAborted$).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    )
      .subscribe({
        next: response => {
          this.dialogRef.close();
          if (this.rememberMe) {
            this.loginRememberService.rememberToken(response.token);
          }
          this.router.navigate([this.data.redirectUrl]);
        },
        error: (error: ApiError) => {
          switch (error.code) {
            case ApiErrorEnum.LOGIN_INVALID:
              this.alertService.toast(this.translate.instant('ERROR_INVALID_NAME_OR_PASSWORD'));
              break;
            case ApiErrorEnum.UNSUPPORTED_VERSION:
              this.alertService.toast(this.translate.instant('ERROR_UNSUPPORTED_VERSION'));
              break;
          }
        }
      });
  }

  changeServer(): Promise<void> {
    const dialog = this.dialog.open(ChangeServerPopupComponent, {
      maxWidth: '100%',
      width: '450px',
      data: { apiUrl: '' }
    });

    return dialog.afterClosed().toPromise()
      .catch(() => undefined);
  }

  resetPassword() {
    this.dialogRef.close();
    this.router.navigate(['/reset-password']);
  }

  register() {
    this.dialogRef.close();
    this.router.navigate(['/register']);
  }

  ngOnDestroy() {
    this.loginAborted$.next();
    this.loginAborted$.complete();
  }

}
