import { Component, DestroyRef, inject } from '@angular/core';
import { ApiErrorEnum } from '@ptcg/common';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { ApiError } from '../../api/api.error';
import { AlertService } from '../../shared/alert/alert.service';
import { ProfileService } from '../../api/services/profile.service';

@Component({
  selector: 'ptcg-change-password-popup',
  templateUrl: './change-password-popup.component.html',
  styleUrls: ['./change-password-popup.component.scss']
})
export class ChangePasswordPopupComponent {

  public currentPassword: string;
  public newPassword: string;
  public invalidPassword: string;
  public loading = false;
  private destroyRef = inject(DestroyRef);

  constructor(
    private alertService: AlertService,
    private dialogRef: MatDialogRef<ChangePasswordPopupComponent>,
    private profileService: ProfileService,
    private translate: TranslateService
  ) { }

  public changePassword() {
    this.loading = true;
    this.profileService.changePassword(this.currentPassword, this.newPassword).pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.dialogRef.close();
        this.alertService.toast(this.translate.instant('SET_PASSWORD_SUCCESS'));
      },
      error: (error: ApiError) => {
        if (error.code === ApiErrorEnum.LOGIN_INVALID) {
          this.invalidPassword = this.currentPassword;
        }
      }
    });
  }

}
