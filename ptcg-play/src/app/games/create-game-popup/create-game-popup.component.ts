import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface CreateGamePopupData {
  decks: string[];
}

interface SelectOption<T> {
  value: T;
  viewValue: string;
}

@Component({
  selector: 'ptcg-create-game-popup',
  templateUrl: './create-game-popup.component.html',
  styleUrls: ['./create-game-popup.component.scss']
})
export class CreateGamePopupComponent {

  public deckOptions: SelectOption<string>[] = [];
  public time = 0;
  public deck = '';

  public timeOptions: SelectOption<number>[] = [
    { value: 0, viewValue: 'No limit' },
    { value: 600, viewValue: '10 min' },
    { value: 1200, viewValue: '20 min' },
    { value: 1800, viewValue: '30 min' }
  ];

  constructor(
    private dialogRef: MatDialogRef<CreateGamePopupComponent>,
    @Inject(MAT_DIALOG_DATA) data: CreateGamePopupData,
  ) { }

  public confirm() {
    this.dialogRef.close(true);
  }

  public cancel() {
    this.dialogRef.close();
  }

}
