import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { LoginPopupComponent } from './login-popup.component';

@Injectable({
  providedIn: 'root'
})
export class LoginPopupService {

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginPopupComponent, {
      maxWidth: '350px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
