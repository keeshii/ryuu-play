import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CardType, SuperType } from '@ptcg/common';
import { MatLegacySelectChange as MatSelectChange } from '@angular/material/legacy-select';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { Deck } from '../../api/interfaces/deck.interface';
import { DeckEditToolbarFilter } from './deck-edit-toolbar-filter.interface';
import { ImportDeckPopupService } from '../import-deck-popup/import-deck-popup.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-deck-edit-toolbar',
  templateUrl: './deck-edit-toolbar.component.html',
  styleUrls: ['./deck-edit-toolbar.component.scss']
})
export class DeckEditToolbarComponent {

  @Input() deck: Deck;

  @Input() disabled: boolean;

  @Output() filterChange = new EventEmitter<DeckEditToolbarFilter>();

  @Output() save = new EventEmitter<void>();

  @Output() import = new EventEmitter<string[]>();

  @Output() export = new EventEmitter<void>();

  public formatNames: string[];

  public cardTypes = [
    {value: CardType.NONE, label: 'LABEL_NONE' },
    {value: CardType.COLORLESS, label: 'LABEL_COLORLESS' },
    {value: CardType.GRASS, label: 'LABEL_GRASS' },
    {value: CardType.FIGHTING, label: 'LABEL_FIGHTING' },
    {value: CardType.PSYCHIC, label: 'LABEL_PSYCHIC' },
    {value: CardType.WATER, label: 'LABEL_WATER' },
    {value: CardType.LIGHTNING, label: 'LABEL_LIGHTNING' },
    {value: CardType.METAL, label: 'LABEL_METAL' },
    {value: CardType.DARK, label: 'LABEL_DARK' },
    {value: CardType.FIRE, label: 'LABEL_FIRE' },
    {value: CardType.DRAGON, label: 'LABEL_DRAGON' },
    {value: CardType.FAIRY, label: 'LABEL_FAIRY' },
  ];

  public superTypes = [
    {value: SuperType.POKEMON, label: 'LABEL_POKEMON' },
    {value: SuperType.TRAINER, label: 'LABEL_TRAINER' },
    {value: SuperType.ENERGY, label: 'LABEL_ENERGY' },
  ];

  public filterValue: DeckEditToolbarFilter;

  constructor(
    private importDeckPopupService: ImportDeckPopupService,
    private cardBaseService: CardsBaseService
  ) {
    this.formatNames = cardBaseService.getAllFormats().map(f => f.name);

    this.filterValue = {
      formatName: '',
      searchValue: '',
      superTypes: [],
      cardTypes: [],
    };
  }

  public onSave() {
    this.save.next();
  }

  public onSearch(value: string) {
    this.filterValue.searchValue = value;
    this.filterChange.next({...this.filterValue});
  }

  public onFormatChange(change: MatSelectChange) {
    this.filterValue.formatName = change.value;
    this.filterChange.next({...this.filterValue});
  }

  public onSuperTypeChange(change: MatSelectChange) {
    this.filterValue.superTypes = change.value;
    this.filterChange.next({...this.filterValue});
  }

  public onCardTypeChange(change: MatSelectChange) {
    this.filterValue.cardTypes = change.value;
    this.filterChange.next({...this.filterValue});
  }

  public importFromFile() {
    const dialogRef = this.importDeckPopupService.openDialog();
    dialogRef.afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: cardNames => {
          if (cardNames) {
            this.import.next(cardNames);
          }
      }});
  }

  public exportToFile() {
    this.export.next();
  }

}
