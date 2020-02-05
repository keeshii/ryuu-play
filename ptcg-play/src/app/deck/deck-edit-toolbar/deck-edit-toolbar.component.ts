import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CardType, SuperType } from 'ptcg-server';
import { MatSelectChange } from '@angular/material';

import { DeckEditToolbarFilter } from './deck-edit-toolbar-filter.interface';

@Component({
  selector: 'ptcg-deck-edit-toolbar',
  templateUrl: './deck-edit-toolbar.component.html',
  styleUrls: ['./deck-edit-toolbar.component.scss']
})
export class DeckEditToolbarComponent implements OnInit {

  @Input() deckName: string;

  @Input() disabled: boolean;

  @Output() filterChange = new EventEmitter<DeckEditToolbarFilter>();

  @Output() save = new EventEmitter<void>();

  public cardTypes = [
    {value: CardType.NONE, label: 'None' },
    {value: CardType.COLORLESS, label: 'Colorless' },
    {value: CardType.GRASS, label: 'Grass' },
    {value: CardType.FIGHTING, label: 'Fighting' },
    {value: CardType.PSYCHIC, label: 'Psychic' },
    {value: CardType.WATER, label: 'Water' },
    {value: CardType.LIGHTNING, label: 'Lightning' },
    {value: CardType.METAL, label: 'Metal' },
    {value: CardType.DARK, label: 'Dark' },
    {value: CardType.FIRE, label: 'Fire' },
    {value: CardType.DRAGON, label: 'Dragon' },
    {value: CardType.FAIRY, label: 'Fairy' },
  ];

  public superTypes = [
    {value: SuperType.POKEMON, label: 'Pokemon' },
    {value: SuperType.TRAINER, label: 'Trainer' },
    {value: SuperType.ENERGY, label: 'Energy' },
  ];

  public filterValue: DeckEditToolbarFilter;

  constructor() {
    this.filterValue = {
      searchValue: '',
      superTypes: [],
      cardTypes: [],
    };
  }

  ngOnInit() {
  }

  public onSave() {
    this.save.next();
  }

  public onSearch(value: string) {
    this.filterValue.searchValue = value;
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

}
