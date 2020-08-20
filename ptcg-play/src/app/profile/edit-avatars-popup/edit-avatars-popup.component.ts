import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AvatarInfo, UserInfo } from 'ptcg-server';
import { finalize } from 'rxjs/operators';

import { AddAvatarPopupService } from '../add-avatar-popup/add-avatar-popup.service';
import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { AvatarService } from '../../api/services/avatar.service';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-edit-avatars-popup',
  templateUrl: './edit-avatars-popup.component.html',
  styleUrls: ['./edit-avatars-popup.component.scss']
})
export class EditAvatarsPopupComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = ['default', 'image', 'name', 'actions'];
  public loading = false;
  public defaultAvatar: AvatarInfo;
  public avatars: AvatarInfo[] = [];
  private user: UserInfo;

  constructor(
    private alertService: AlertService,
    private addAvatarPopupService: AddAvatarPopupService,
    private avatarService: AvatarService,
    private dialogRef: MatDialogRef<EditAvatarsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { user: UserInfo },
  ) {
    this.user = data.user;
  }

  public addAvatar() {
    const dialogRef = this.addAvatarPopupService.openDialog();
    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this))
      .subscribe({
        next: avatar => {
          if (avatar) {
            this.refreshAvatars();
          }
      }});
  }

  public deleteAvatar(avatarId: number) {
    this.loading = true;
    this.avatarService.deleteAvatar(avatarId)
      .pipe(
        finalize(() => { this.loading = false; }),
        takeUntilDestroyed(this)
      )
      .subscribe({
        next: () => {
          this.refreshAvatars();
        },
        error: (error: ApiError) => {
          this.alertService.toast(error.code);
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
      takeUntilDestroyed(this)
    ).subscribe(() => {
      this.refreshAvatars();
    }, (error: ApiError) => {
      this.alertService.toast('Error occured, try again.');
    });
  }

  public markAsDefault(avatar: AvatarInfo) {
    this.loading = true;
    this.avatarService.markAsDefault(avatar.id)
      .pipe(
        finalize(() => { this.loading = false; }),
        takeUntilDestroyed(this)
      )
      .subscribe({
        next: () => {
          this.defaultAvatar = avatar;
        },
        error: (error: ApiError) => {
          this.alertService.toast(error.code);
        }
      });
  }

  ngOnInit() {
    this.refreshAvatars();
  }

  ngOnDestroy() { }

  private refreshAvatars(): void {
    this.loading = true;
    this.avatarService.getList()
      .pipe(
        finalize(() => { this.loading = false; }),
        takeUntilDestroyed(this)
      )
      .subscribe({
        next: response => {
          this.avatars = response.avatars;
          this.defaultAvatar = this.avatars.find(a => {
            return a.fileName === this.user.avatarFile;
          });
        },
        error: (error: ApiError) => {
          this.alertService.toast(error.message);
        }
      });
  }

  private getAvatarName(name: string = ''): Promise<string | undefined> {
    const invalidValues = this.avatars.map(a => a.name);
    return this.alertService.inputName({
      title: 'Enter avatar name',
      placeholder: 'Avatar name',
      invalidValues,
      value: name
    });
  }

}
