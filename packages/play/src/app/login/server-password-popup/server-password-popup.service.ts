import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Observable } from 'rxjs';

import { ServerPasswordPopupComponent } from './server-password-popup.component';

@Injectable({
  providedIn: 'root'
})
export class ServerPasswordPopupService {

  constructor(public dialog: MatDialog) {}

  openDialog(): Observable<string> {
    const dialogRef = this.dialog.open(ServerPasswordPopupComponent, {
      maxWidth: '350px',
      data: {}
    });

    return dialogRef.afterClosed();
  }

}
