import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ImportDeckPopupComponent } from './import-deck-popup.component';

@Injectable({
  providedIn: 'root'
})
export class ImportDeckPopupService {

  constructor(public dialog: MatDialog) { }

  public openDialog(): MatDialogRef<ImportDeckPopupComponent, string[] | undefined> {
    const dialogRef = this.dialog.open(ImportDeckPopupComponent, {
      maxWidth: '100%',
      width: '350px',
      data: { name }
    });

    return dialogRef;
  }
}
