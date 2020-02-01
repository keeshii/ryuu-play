import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { ApiError } from '../api/api.error';
import { Deck } from '../api/interfaces/deck.interface';
import { DeckService } from '../api/services/deck.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = ['name', 'cardTypes', 'isValid', 'actions'];
  public decks: Deck[] = [];
  public loading = false;

  constructor(private deckService: DeckService) { }

  public ngOnInit() {
    this.loading = true;
    this.deckService.getList().pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this)
    )
      .subscribe(response => {
        this.decks = response.decks;
      }, (error: ApiError) => { });
  }

  public ngOnDestroy() { }

}
