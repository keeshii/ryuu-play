import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Card } from 'ptcg-server';

@Component({
  selector: 'ptcg-image-popup',
  templateUrl: './image-popup.component.html',
  styleUrls: ['./image-popup.component.scss']
})
export class ImagePopupComponent {

  public title: string;
  public card: Card;
  public avatarFile: string;

  constructor(
    private dialogRef: MatDialogRef<ImagePopupComponent>,
    @Inject(MAT_DIALOG_DATA) data: { title?: string, card?: Card, avatarFile?: string },
  ) {
    this.title = data.title || 'Image';
    this.avatarFile = data.avatarFile;
    this.card = data.card;
  }

  public confirm() {
    this.dialogRef.close();
  }

}
