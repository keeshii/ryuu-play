import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectPopupOption } from '../../shared/alert/select-popup/select-popup.component';
import { GameSettings } from 'ptcg-server';

export interface CreateGamePopupData {
  decks: SelectPopupOption<number>[];
}

export interface CreateGamePopupResult {
  deckId: number;
  gameSettings: GameSettings;
}

@Component({
  selector: 'ptcg-create-game-popup',
  templateUrl: './create-game-popup.component.html',
  styleUrls: ['./create-game-popup.component.scss']
})
export class CreateGamePopupComponent {

  public decks: SelectPopupOption<number>[];
  public deckId: number;
  public settings = new GameSettings();

  public timeLimits: SelectPopupOption<number>[] = [
    { value: 0, viewValue: 'No limit' },
    { value: 600, viewValue: '10 min' },
    { value: 1200, viewValue: '20 min' },
    { value: 1800, viewValue: '30 min' }
  ];

  constructor(
    private dialogRef: MatDialogRef<CreateGamePopupComponent>,
    @Inject(MAT_DIALOG_DATA) data: CreateGamePopupData,
  ) {
    this.decks = data.decks;
    this.deckId = data.decks[0].value;
  }

  public confirm() {
    this.dialogRef.close({
      deckId: this.deckId,
      gameSettings: this.settings
    });
  }

  public cancel() {
    this.dialogRef.close();
  }

}
