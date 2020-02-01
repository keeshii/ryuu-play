import { Component, OnInit } from '@angular/core';

import { Deck } from '../api/interfaces/deck.interface';
import { DeckService } from '../api/services/deck.service';

@Component({
  selector: 'ptcg-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent implements OnInit {

  public displayedColumns: string[] = ['name', 'cardTypes', 'isValid', 'actions'];
  public decks: Deck[] = [];

  constructor(private deckService: DeckService) { }

  public ngOnInit() {
    this.deckService.getAll().subscribe(response => {
      this.decks = response.decks;
    });
  }

}
