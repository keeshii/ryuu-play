import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AvatarInfo } from 'ptcg-server';

import { ChangePasswordPopupComponent } from './change-password-popup.component';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordPopupService {

  constructor(public dialog: MatDialog) { }

  public openDialog(): MatDialogRef<ChangePasswordPopupComponent, AvatarInfo | undefined> {
    const dialogRef = this.dialog.open(ChangePasswordPopupComponent, {
      maxWidth: '100%',
      width: '450px'
    });

    return dialogRef;
  }
}
