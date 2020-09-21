import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ChooseAvatarPopupComponent } from './choose-avatar-popup.component';

@Injectable({
  providedIn: 'root'
})
export class ChooseAvatarPopupService {

  constructor(public dialog: MatDialog) { }

  public openDialog(userId: number, selected: string):
    MatDialogRef<ChooseAvatarPopupComponent, string | undefined> {
    const dialogRef = this.dialog.open(ChooseAvatarPopupComponent, {
      maxWidth: '100%',
      width: '565px',
      autoFocus: false,
      data: { userId, selected }
    });

    return dialogRef;
  }
}
