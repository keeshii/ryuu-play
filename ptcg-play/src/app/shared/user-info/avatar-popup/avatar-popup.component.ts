
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
