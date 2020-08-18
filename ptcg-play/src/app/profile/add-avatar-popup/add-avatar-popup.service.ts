import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { AddAvatarPopupComponent } from './add-avatar-popup.component';

@Injectable({
  providedIn: 'root'
})
export class AddAvatarPopupService {

  constructor(public dialog: MatDialog) { }

  public openDialog(
    name: string = ''
  ): MatDialogRef<AddAvatarPopupComponent, string | undefined> {
    const dialogRef = this.dialog.open(AddAvatarPopupComponent, {
      maxWidth: '100%',
      width: '350px',
      data: { name }
    });

    return dialogRef;
  }
}
