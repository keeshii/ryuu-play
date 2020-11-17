import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ChangeEmailPopupComponent } from './change-email-popup/change-email-popup.component';
import { ChangePasswordPopupComponent } from './change-password-popup/change-password-popup.component';
import { EditAvatarsPopupComponent } from './edit-avatars-popup/edit-avatars-popup.component';

@Injectable({
  providedIn: 'root'
})
export class ProfilePopupService {

  constructor(public dialog: MatDialog) { }

  public openEditAvatarsPopup(userId: number): MatDialogRef<EditAvatarsPopupComponent, string | undefined> {
    const dialogRef = this.dialog.open(EditAvatarsPopupComponent, {
      maxWidth: '100%',
      width: '500px',
      autoFocus: false,
      data: { userId }
    });

    return dialogRef;
  }

  public openChangePasswordPopup(): MatDialogRef<ChangePasswordPopupComponent, undefined> {
    const dialogRef = this.dialog.open(ChangePasswordPopupComponent, {
      maxWidth: '100%',
      width: '450px'
    });

    return dialogRef;
  }

  public openChangeEmailPopup(userId: number): MatDialogRef<ChangeEmailPopupComponent, undefined> {
    const dialogRef = this.dialog.open(ChangeEmailPopupComponent, {
      maxWidth: '100%',
      width: '450px',
      data: { userId }
    });

    return dialogRef;
  }

}
