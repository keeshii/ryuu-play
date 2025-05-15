import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ApiErrorEnum } from '@ptcg/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { ResetPasswordService } from '../../api/services/reset-password.service';

@Component({
  selector: 'ptcg-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.scss']
})
export class SetNewPasswordComponent implements OnInit {

  public loading = false;
  public confirmPassword: string;
  public newPassword: string;
  public token: string;
  private destroyRef = inject(DestroyRef);

  constructor(
    private alertService: AlertService,
    private resetPasswordService: ResetPasswordService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: paramMap => {
        this.token = paramMap.get('token');
      }
    });
  }

  public changePassword() {
    this.loading = true;
    this.resetPasswordService.changePassword(this.token, this.newPassword).pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: async () => {
        await this.alertService.alert(this.translate.instant('SET_PASSWORD_SUCCESS'));
        this.router.navigate(['/games']);
      },
      error: (error: ApiError) => {
        if (error.code === ApiErrorEnum.LOGIN_INVALID) {
          this.alertService.toast(this.translate.instant('SET_PASSWORD_INVALID_TOKEN'));
        }
      }
    });
  }

}
