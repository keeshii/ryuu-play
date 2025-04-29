
import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Card } from 'ptcg-server';

@Component({
  selector: 'ptcg-avatar-popup',
  templateUrl: './avatar-popup.component.html',
  styleUrls: ['./avatar-popup.component.scss']
})
export class AvatarPopupComponent {

  public avatarFile: string;

  constructor(
    private dialogRef: MatDialogRef<AvatarPopupComponent>,
    @Inject(MAT_DIALOG_DATA) data: { avatarFile: string },
  ) {
    this.avatarFile = data.avatarFile;
  }

  public confirm() {
    this.dialogRef.close();
  }

}
