import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { EditAvatarsPopupComponent } from './edit-avatars-popup.component';

@Injectable({
  providedIn: 'root'
})
export class EditAvatarsPopupService {

  constructor(public dialog: MatDialog) { }

  public openDialog(
    name: string = ''
  ): MatDialogRef<EditAvatarsPopupComponent, string | undefined> {
    const dialogRef = this.dialog.open(EditAvatarsPopupComponent, {
      maxWidth: '100%',
      width: '500px',
      data: { name },
      autoFocus: false
    });

    return dialogRef;
  }
}
