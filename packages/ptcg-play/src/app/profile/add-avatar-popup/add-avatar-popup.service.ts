import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { AvatarInfo } from '@ryuu-play/ptcg-server';

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
