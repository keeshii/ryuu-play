import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  public defaultAvatar: any;
  public avatars: any[] = [];

  constructor(
    private alertService: AlertService,
    private addAvatarPopupService: AddAvatarPopupService,
    private avatarService: AvatarService,
    private dialogRef: MatDialogRef<EditAvatarsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { name: string },
  ) {
  }

  public addAvatar() {
    this.addAvatarPopupService.openDialog();
  }

  ngOnInit() {
    this.loading = true;
    return this.avatarService.getList()
      .pipe(
        finalize(() => { this.loading = false; }),
        takeUntilDestroyed(this)
      )
      .subscribe({
        next: response => {
          this.avatars = response.avatars;
        },
        error: (error: ApiError) => {
          this.alertService.toast(error.message);
        }
      });
  }

  ngOnDestroy() { }

}
