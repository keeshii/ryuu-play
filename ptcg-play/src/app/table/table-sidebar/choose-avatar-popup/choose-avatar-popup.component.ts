import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AvatarInfo } from 'ptcg-server';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../../shared/alert/alert.service';
import { AvatarService } from '../../../api/services/avatar.service';
import { ApiError } from '../../../api/api.error';
import { SessionService } from '../../../shared/session/session.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-choose-avatar-popup',
  templateUrl: './choose-avatar-popup.component.html',
  styleUrls: ['./choose-avatar-popup.component.scss']
})
export class ChooseAvatarPopupComponent implements OnInit {

  public loading = false;
  public avatars: AvatarInfo[] = [];
  public selected: string;
  private initialSelected: string;
  private userId: number;
  private defaultAvatar: string;

  constructor(
    private alertService: AlertService,
    private avatarService: AvatarService,
    private dialogRef: MatDialogRef<ChooseAvatarPopupComponent>,
    private sessionService: SessionService,
    @Inject(MAT_DIALOG_DATA) data: { userId: number, selected: string },
  ) {
    this.userId = data.userId;
    this.initialSelected = data.selected;
    this.selected = data.selected;

    const session = this.sessionService.session;
    const user = session.users[data.userId];
    this.defaultAvatar = user ? user.avatarFile : '';
  }

  ngOnInit(): void {
    this.loading = true;
    this.avatarService.getList(this.userId).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this),
    ).subscribe({
      next: response => {
        this.avatars = response.avatars;

        const avatar = this.avatars.find(a => a.name === this.selected)
          || this.avatars.find(a => a.fileName === this.defaultAvatar);

        if (avatar !== undefined) {
          this.selected = avatar.name;
        }

      },
      error: (error: ApiError) => {
        this.alertService.toast(error.message);
      }
    });
  }

  public close() {
    this.dialogRef.close();
  }

  public chooseAvatar() {
    let selected = this.selected;

    const defaultAvatar = this.avatars.find(a => a.fileName === this.defaultAvatar);
    if (defaultAvatar !== undefined && defaultAvatar.name === this.selected) {
      selected = '';
    }

    if (selected === this.initialSelected) {
      this.dialogRef.close();
      return;
    }

    this.dialogRef.close(selected);
  }

}
