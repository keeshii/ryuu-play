import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { EditAvatarsPopupComponent } from './edit-avatars-popup.component';

@Injectable({
  providedIn: 'root'
})
export class EditAvatarsPopupService {

  constructor(public dialog: MatDialog) { }

  public openDialog(userId: number): MatDialogRef<EditAvatarsPopupComponent, string | undefined> {
    const dialogRef = this.dialog.open(EditAvatarsPopupComponent, {
      maxWidth: '100%',
      width: '500px',
      autoFocus: false,
      data: { userId }
    });

    return dialogRef;
  }
}
