import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReplayImport } from 'ptcg-server';

import { ImportReplayPopupComponent } from './import-replay-popup.component';

@Injectable({
  providedIn: 'root'
})
export class ImportReplayPopupService {

  constructor(public dialog: MatDialog) { }

  public openDialog(): MatDialogRef<ImportReplayPopupComponent, ReplayImport | undefined> {
    const dialogRef = this.dialog.open(ImportReplayPopupComponent, {
      maxWidth: '100%',
      width: '350px',
      data: { name }
    });

    return dialogRef;
  }
}
