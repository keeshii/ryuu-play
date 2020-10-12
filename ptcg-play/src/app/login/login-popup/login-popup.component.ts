import { Component, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { ChangeServerPopupComponent } from '../change-server-popup/change-server-popup.component';
import { LoginService } from '../../api/services/login.service';
import { LoginRememberService } from '../login-remember.service';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';
import { environment } from '../../../environments/environment';

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
    @Inject(MAT_DIALOG_DATA) private data: { redirectUrl: string },
  ) { }

  login() {
    this.loading = true;
    this.loginService.login(this.name, this.password, this.loginAborted$).pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this)
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
          this.alertService.toast(error.code || error.message);
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
