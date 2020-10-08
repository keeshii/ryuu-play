import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Card } from 'ptcg-server';

import { AlertPopupComponent } from './alert-popup/alert-popup.component';
import { ConfirmPopupComponent } from './confirm-popup/confirm-popup.component';
import { ImagePopupComponent } from './image-popup/image-popup.component';
import { InputNumberPopupComponent, InputNumberPopupData } from './input-number-popup/input-number-popup.component';
import { InputNamePopupComponent, InputNamePopupData } from './input-name-popup/input-name-popup.component';
import { SelectPopupComponent, SelectPopupData } from './select-popup/select-popup.component';

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

  public cardImage(card: Card, title?: string): Promise<void> {
    const dialog = this.dialog.open(ImagePopupComponent, {
      maxWidth: '100%',
      data: { card, title }
    });

    return dialog.afterClosed().toPromise()
      .catch(() => false);
  }

  public avatarImage(avatarFile: string, title?: string): Promise<void> {
    const dialog = this.dialog.open(ImagePopupComponent, {
      maxWidth: '100%',
      data: { avatarFile, title }
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

  public inputName(options: InputNamePopupData = {}): Promise<string | undefined> {
    const dialog = this.dialog.open(InputNamePopupComponent, {
      maxWidth: '100%',
      width: '350px',
      data: options
    });

    return dialog.afterClosed().toPromise()
      .catch(() => undefined);
  }

  public select<T>(options: SelectPopupData<T> = {}): Promise<T | undefined> {
    const dialog = this.dialog.open(SelectPopupComponent, {
      maxWidth: '100%',
      width: '350px',
      data: options
    });

    return dialog.afterClosed().toPromise()
      .catch(() => undefined);
  }

}
