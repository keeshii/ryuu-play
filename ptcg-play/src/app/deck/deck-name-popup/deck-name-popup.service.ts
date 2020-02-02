import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DeckNamePopupComponent } from './deck-name-popup.component';

@Injectable({
  providedIn: 'root'
})
export class DeckNamePopupService {

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    this.dialog.open(DeckNamePopupComponent, {
      maxWidth: '100%',
      width: '350px',
      data: { }
    });
  }

}
