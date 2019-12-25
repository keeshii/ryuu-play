import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

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
    private loginService: LoginService,
    public dialogRef: MatDialogRef<LoginPopupComponent>,
    private router: Router
  ) { }

  login() {
    this.loading = true;
    this.loginService.login(this.name, this.password).pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this)
    )
      .subscribe(response => {
        this.dialogRef.close();
      }, (error: ApiError) => {
        console.log(error);
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
