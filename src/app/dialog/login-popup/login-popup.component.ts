import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'ptcg-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss']
})
export class LoginPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<LoginPopupComponent>
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  close() {
    this.dialogRef.close();
  }

}
