import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-deck-edit',
  templateUrl: './deck-edit.component.html',
  styleUrls: ['./deck-edit.component.scss']
})
export class DeckEditComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this))
      .subscribe(paramMap => {
        const deckId = parseInt(paramMap.get('deckId'), 10);
        console.log(deckId);
      });
  }

  ngOnDestroy() { }

}
