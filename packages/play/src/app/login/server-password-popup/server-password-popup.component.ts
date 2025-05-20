import { Component } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'ptcg-server-password-popup',
  templateUrl: './server-password-popup.component.html',
  styleUrls: ['./server-password-popup.component.scss']
})
export class ServerPasswordPopupComponent {

  public loading = false;
  public password = '';

  constructor(
    public dialogRef: MatDialogRef<ServerPasswordPopupComponent>,
  ) { }

  public cancel() {
    this.dialogRef.close();
  }

}
