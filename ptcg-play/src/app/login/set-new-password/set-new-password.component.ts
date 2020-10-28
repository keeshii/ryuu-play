import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { ResetPasswordService } from '../../api/services/reset-password.service';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.scss']
})
export class SetNewPasswordComponent implements OnInit, OnDestroy {

  public loading = false;
  public newPassword: string;
  public token: string;

  constructor(
    private alertService: AlertService,
    private resetPasswordService: ResetPasswordService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this)).subscribe({
      next: paramMap => {
        this.token = paramMap.get('token');
      }
    });
  }

  ngOnDestroy(): void {
  }

  public changePassword() {
    this.loading = true;
    this.resetPasswordService.changePassword(this.token, this.newPassword).pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this)
    ).subscribe({
      next: async () => {
        await this.alertService.alert('RESET_PASSWORD_SUCCESS');
        this.router.navigate(['/games']);
      },
      error: (error: ApiError) => {
        this.alertService.toast(error.code || error.message);
      }
    });
  }

}
