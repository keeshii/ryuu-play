import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiErrorEnum } from 'ptcg-server';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';

import { ApiError } from '../../api/api.error';
import { AlertService } from '../../shared/alert/alert.service';
import { ProfileService } from '../../api/services/profile.service';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-change-password-popup',
  templateUrl: './change-password-popup.component.html',
  styleUrls: ['./change-password-popup.component.scss']
})
export class ChangePasswordPopupComponent implements OnInit, OnDestroy {

  public currentPassword: string;
  public newPassword: string;
  public invalidPassword: string;
  public loading = false;

  constructor(
    private alertService: AlertService,
    private dialogRef: MatDialogRef<ChangePasswordPopupComponent>,
    private profileService: ProfileService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  public changePassword() {
    this.loading = true;
    this.profileService.changePassword(this.currentPassword, this.newPassword).pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this)
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
