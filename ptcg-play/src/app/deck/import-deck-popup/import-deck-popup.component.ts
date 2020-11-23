import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { FileInput } from '../../shared/file-input/file-input.model';
import { SessionService } from '../../shared/session/session.service';

@Component({
  selector: 'ptcg-import-deck-popup',
  templateUrl: './import-deck-popup.component.html',
  styleUrls: ['./import-deck-popup.component.scss']
})
export class ImportDeckPopupComponent implements OnInit, OnDestroy {

  public loading = false;
  public deckFile: FileInput;
  public name: string;
  public deckError: string;
  public maxFileSize: number;
  public cardNames: string[] | undefined;

  constructor(
    private cardsBaseService: CardsBaseService,
    private dialogRef: MatDialogRef<ImportDeckPopupComponent>,
    private sessionService: SessionService
  ) {
    this.maxFileSize = this.sessionService.session.config.avatarFileSize;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  public updatePreview(value: FileInput) {
    this.cardNames = undefined;

    if (value === null || value.files.length === 0) {
      this.deckError = '';
      this.cardNames = undefined;
      return;
    }

    const file = value.files[0];

    // handled by different validator
    if (file.size > this.maxFileSize) {
      this.deckError = '';
      this.cardNames = undefined;
      return;
    }

    this.loading = true;
    const fileReader = new FileReader();

    fileReader.onload = event => {
      const deckData = event.target.result as string;
      const cardNames = deckData.split(/\n/).filter(name => name !== '');
      const cards = cardNames.map(name => this.cardsBaseService.getCardByName(name));
      if (cards.every(c => c !== undefined)) {
        this.cardNames = cardNames;
        this.deckError = '';
      } else {
        this.cardNames = undefined;
        this.deckError = 'CANNOT_DECODE_DECK_FILE';
      }
      this.loading = false;
    };

    fileReader.onerror = () => {
      this.loading = false;
      this.deckError = 'CANNOT_READ_DECK_FILE';
    };

    fileReader.readAsText(file);
  }

  public importDeck() {
    this.dialogRef.close(this.cardNames);
  }

}
