import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'ptcg-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss']
})
export class LoginPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<LoginPopupComponent>,
    private router: Router
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  register() {
    this.dialogRef.close();
    this.router.navigate(['/register']);
  }

  close() {
    this.dialogRef.close();
  }

}
