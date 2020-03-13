import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { LoginPopupComponent } from './login-popup.component';

@Injectable({
  providedIn: 'root'
})
export class LoginPopupService {

  public redirectUrl: string;

  constructor(public dialog: MatDialog) {
    this.redirectUrl = '/games';
  }

  openDialog(): void {
    this.dialog.open(LoginPopupComponent, {
      maxWidth: '350px',
      data: { redirectUrl: this.redirectUrl }
    });
  }

}
