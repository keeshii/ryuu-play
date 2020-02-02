import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'ptcg-deck-name-popup',
  templateUrl: './deck-name-popup.component.html',
  styleUrls: ['./deck-name-popup.component.scss']
})
export class DeckNamePopupComponent implements OnInit {

  public name: string;

  constructor(
    private dialogRef: MatDialogRef<DeckNamePopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { name: string },
  ) {
    this.name = data.name || '';
  }

  ngOnInit() {
  }

  public confirm() {
    this.dialogRef.close(this.name);
  }

  public cancel() {
    this.dialogRef.close();
  }

}
