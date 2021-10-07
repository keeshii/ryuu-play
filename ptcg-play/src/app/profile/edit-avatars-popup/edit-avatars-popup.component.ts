import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AvatarInfo } from 'ptcg-server';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';

import { AddAvatarPopupService } from '../add-avatar-popup/add-avatar-popup.service';
import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { AvatarService } from '../../api/services/avatar.service';
import { SessionService } from '../../shared/session/session.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-edit-avatars-popup',
  templateUrl: './edit-avatars-popup.component.html',
  styleUrls: ['./edit-avatars-popup.component.scss']
})
export class EditAvatarsPopupComponent implements OnInit {

  public displayedColumns: string[] = ['default', 'image', 'name', 'actions'];
  public loading = false;
  public defaultAvatar$: Observable<string>;
  public avatars: AvatarInfo[] = [];
  private userId: number;

  constructor(
    private alertService: AlertService,
    private addAvatarPopupService: AddAvatarPopupService,
    private avatarService: AvatarService,
    private sessionService: SessionService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) data: { userId: number },
  ) {
    this.userId = data.userId;
    this.defaultAvatar$ = this.sessionService.get(session => {
      const user = session.users[data.userId];
      return user ? user.avatarFile : '';
    });
  }

  public addAvatar() {
    const dialogRef = this.addAvatarPopupService.openDialog();
    dialogRef.afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: avatar => {
          if (avatar) {
            this.avatars = [ ...this.avatars, avatar ];
          }
      }});
  }

  public deleteAvatar(avatarId: number) {
    this.loading = true;
    this.avatarService.deleteAvatar(avatarId)
      .pipe(
        finalize(() => { this.loading = false; }),
        untilDestroyed(this)
      )
      .subscribe({
        next: () => {
          this.avatars = this.avatars.filter(a => a.id !== avatarId);
        },
        error: (error: ApiError) => {
          if (!error.handled) {
            this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
          }
        }
      });
  }

  public async renameAvatar(avatarId: number, previousName: string) {
    const name = await this.getAvatarName(previousName);
    if (name === undefined) {
      return;
    }

    this.loading = true;
    this.avatarService.rename(avatarId, name).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    ).subscribe({
      next: response => {
        const index = this.avatars.findIndex(a => a.id === avatarId);
        if (index !== -1) {
          this.avatars = [ ...this.avatars ];
          this.avatars[index] = response.avatar;
        }
      },
      error: (error: ApiError) => {
        if (!error.handled) {
          this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
        }
      }
    });
  }

  public markAsDefault(avatar: AvatarInfo) {
    this.loading = true;
    this.avatarService.markAsDefault(avatar.id)
      .pipe(
        finalize(() => { this.loading = false; }),
        untilDestroyed(this)
      )
      .subscribe({
        error: (error: ApiError) => {
          if (!error.handled) {
            this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
          }
        }
      });
  }

  ngOnInit() {
    this.refreshAvatars();
  }

  private refreshAvatars(): void {
    this.loading = true;
    this.avatarService.getList()
      .pipe(
        finalize(() => { this.loading = false; }),
        untilDestroyed(this)
      )
      .subscribe({
        next: response => {
          this.avatars = response.avatars;
        },
        error: (error: ApiError) => {
          if (!error.handled) {
            this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
          }
        }
      });
  }

  private getAvatarName(name: string = ''): Promise<string | undefined> {
    const invalidValues = this.avatars.map(a => a.name);
    return this.alertService.inputName({
      title: this.translate.instant('PROFILE_ENTER_AVATAR_NAME'),
      placeholder: this.translate.instant('PROFILE_AVATAR_NAME'),
      invalidValues,
      value: name
    });
  }

}
