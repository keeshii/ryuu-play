import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { DeckNamePopupComponent } from './deck-name-popup.component';

@Injectable({
  providedIn: 'root'
})
export class DeckNamePopupService {

  constructor(public dialog: MatDialog) { }

  public openDialog(
    name: string = ''
  ): MatDialogRef<DeckNamePopupComponent, string | undefined> {
    const dialogRef = this.dialog.open(DeckNamePopupComponent, {
      maxWidth: '100%',
      width: '350px',
      data: { name }
    });

    return dialogRef;
  }

}
