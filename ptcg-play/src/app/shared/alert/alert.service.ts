import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';

import { AlertPopupComponent } from './alert-popup/alert-popup.component';
import { ConfirmPopupComponent } from './confirm-popup/confirm-popup.component';
import { InputNumberPopupComponent, InputNumberPopupData } from './input-number-popup/input-number-popup.component';

@Injectable()
export class AlertService {

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  public alert(message: string, title?: string): Promise<void> {
    const dialog = this.dialog.open(AlertPopupComponent, {
      maxWidth: '100%',
      width: '350px',
      data: { message, title }
    });

    return dialog.afterClosed().toPromise()
      .catch(() => false);
  }

  public error(message: string): Promise<void> {
    return this.alert(message, 'Error');
  }

  public toast(message: string, duration: number = 3000) {
    this.snackBar.open(message, '', { duration });
  }

  public confirm(message: string, title?: string): Promise<boolean> {
    const dialog = this.dialog.open(ConfirmPopupComponent, {
      maxWidth: '100%',
      width: '350px',
      data: { message, title }
    });

    return dialog.afterClosed().toPromise()
      .then(result => !!result)
      .catch(() => false);
  }

  public inputNumber(options: InputNumberPopupData = {}): Promise<number | undefined> {
    const dialog = this.dialog.open(InputNumberPopupComponent, {
      maxWidth: '100%',
      width: '350px',
      data: options
    });

    return dialog.afterClosed().toPromise()
      .catch(() => undefined);
  }

}
