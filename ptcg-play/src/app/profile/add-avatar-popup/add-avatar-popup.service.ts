import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AvatarInfo } from 'ptcg-server';

import { AddAvatarPopupComponent } from './add-avatar-popup.component';

@Injectable({
  providedIn: 'root'
})
export class AddAvatarPopupService {

  constructor(public dialog: MatDialog) { }

  public openDialog(): MatDialogRef<AddAvatarPopupComponent, AvatarInfo | undefined> {
    const dialogRef = this.dialog.open(AddAvatarPopupComponent, {
      maxWidth: '100%',
      width: '350px'
    });

    return dialogRef;
  }
}
