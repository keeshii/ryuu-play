import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';

import { AlertService } from 'src/app/shared/alert/alert.service';
import { CardsBaseService } from 'src/app/shared/cards/cards-base.service';
import { DeckEditToolbarFilter } from '../deck-edit-toolbar/deck-edit-toolbar-filter.interface';
import { DeckService } from 'src/app/api/services/deck.service';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';
import { Card } from 'ptcg-server';

@Component({
  selector: 'ptcg-deck-edit',
  templateUrl: './deck-edit.component.html',
  styleUrls: ['./deck-edit.component.scss']
})
export class DeckEditComponent implements OnInit, OnDestroy {

  public loading = false;
  public deckName: string;
  public cards: Card[];
  public toolbarFilter: DeckEditToolbarFilter;

  constructor(
    private alertService: AlertService,
    private cardsBaseService: CardsBaseService,
    private deckService: DeckService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.cards = this.cardsBaseService.getCards();

    this.route.paramMap.pipe(
      switchMap(paramMap => {
        this.loading = true;
        const deckId = parseInt(paramMap.get('deckId'), 10);
        return this.deckService.getDeck(deckId);
      }),
      takeUntilDestroyed(this)
    )
      .subscribe(response => {
        this.loading = false;
        this.deckName = response.deck.name;
      }, async error => {
        await this.alertService.error('Error while loading the deck');
        this.router.navigate(['/decks']);
      });
  }

  ngOnDestroy() { }

}
