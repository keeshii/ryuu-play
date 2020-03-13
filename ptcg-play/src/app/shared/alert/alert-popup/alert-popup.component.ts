import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ptcg-alert-popup',
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.scss']
})
export class AlertPopupComponent {

  public title: string;
  public message: string;

  constructor(
    private dialogRef: MatDialogRef<AlertPopupComponent>,
    @Inject(MAT_DIALOG_DATA) data: { title?: string, message: string },
  ) {
    this.title = data.title || 'Message';
    this.message = data.message;
  }

  public confirm() {
    this.dialogRef.close();
  }

}
