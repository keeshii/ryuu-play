import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ApiErrorEnum } from 'ptcg-server';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { ProfileService } from '../../api/services/profile.service';
import { SessionService } from '../../shared/session/session.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-change-email-popup',
  templateUrl: './change-email-popup.component.html',
  styleUrls: ['./change-email-popup.component.scss']
})
export class ChangeEmailPopupComponent {

  public loading = false;
  public invalidEmail: string;
  public email: string;

  private userId: number;

  constructor(
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) data: { userId: number },
    private dialogRef: MatDialogRef<ChangeEmailPopupComponent>,
    private profileService: ProfileService,
    private sessionService: SessionService,
    private translate: TranslateService
  ) {
    this.userId = data.userId;
    const user = this.sessionService.session.users[data.userId];
    this.email = user ? user.email : '';
  }

  public changeEmail(): void {
    this.loading = true;
    this.profileService.changeEmail(this.email).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    ).subscribe({
      next: () => {
        this.dialogRef.close();

        const users = this.sessionService.session.users;
        users[this.userId] = { ...users[this.userId], email: this.email };
        this.sessionService.set({ users });

        this.alertService.toast(this.translate.instant('PROFILE_CHANGE_EMAIL_SUCCESS'));
      },
      error: (error: ApiError) => {
        if (error.code === ApiErrorEnum.LOGIN_INVALID
          || error.code === ApiErrorEnum.REGISTER_EMAIL_EXISTS) {
          this.invalidEmail = this.email;
        }
      }
    });
  }

}
