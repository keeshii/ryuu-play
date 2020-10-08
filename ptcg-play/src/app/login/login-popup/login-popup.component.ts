import { Component, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { LoginService } from '../../api/services/login.service';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss']
})
export class LoginPopupComponent implements OnDestroy {

  public loading = false;
  public name: string;
  public password: string;

  constructor(
    private alertService: AlertService,
    private loginService: LoginService,
    public dialogRef: MatDialogRef<LoginPopupComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) private data: { redirectUrl: string },
  ) { }

  login() {
    this.loading = true;
    this.loginService.login(this.name, this.password).pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this)
    )
      .subscribe({
        next: () => {
          this.dialogRef.close();
          this.router.navigate([this.data.redirectUrl]);
        },
        error: (error: ApiError) => {
          this.alertService.toast(error.code || error.message);
        }
      });
  }

  resetPassword() {
    this.dialogRef.close();
    this.router.navigate(['/reset-password']);
  }

  register() {
    this.dialogRef.close();
    this.router.navigate(['/register']);
  }

  ngOnDestroy() { }

}
