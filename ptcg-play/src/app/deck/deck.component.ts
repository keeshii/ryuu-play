import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../shared/alert/alert.service';
import { ApiError } from '../api/api.error';
import { DeckListEntry } from '../api/interfaces/deck.interface';
import { DeckService } from '../api/services/deck.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = ['name', 'cardTypes', 'isValid', 'actions'];
  public decks: DeckListEntry[] = [];
  public loading = false;

  constructor(
    private alertService: AlertService,
    private deckService: DeckService
  ) { }

  public ngOnInit() {
    this.refreshList();
  }

  public ngOnDestroy() { }

  private refreshList() {
    this.loading = true;
    this.deckService.getList().pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this)
    )
      .subscribe(response => {
        this.decks = response.decks;
      }, (error: ApiError) => { });
  }

  public async createDeck() {
    const name = await this.getDeckName();
    if (name === undefined) {
      return;
    }

    this.loading = true;
    this.deckService.createDeck(name).pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this)
    ).subscribe(() => {
      this.refreshList();
    }, (error: ApiError) => {
      this.alertService.toast('Error occured, try again.');
    });
  }

  public async deleteDeck(deckId: number) {
    if (!await this.alertService.confirm('Delete the selected deck?')) {
      return;
    }
    this.loading = true;
    this.deckService.deleteDeck(deckId).pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this)
    ).subscribe(() => {
      this.refreshList();
    }, (error: ApiError) => {
      this.alertService.toast('Error occured, try again.');
    });
  }

  public async renameDeck(deckId: number, previousName: string) {
    const name = await this.getDeckName(previousName);
    if (name === undefined) {
      return;
    }

    this.loading = true;
    this.deckService.rename(deckId, name).pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this)
    ).subscribe(() => {
      this.refreshList();
    }, (error: ApiError) => {
      this.alertService.toast('Error occured, try again.');
    });
  }

  public async duplicateDeck(deckId: number) {
    const name = await this.getDeckName();
    if (name === undefined) {
      return;
    }

    this.loading = true;
    this.deckService.duplicate(deckId, name).pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this)
    ).subscribe(() => {
      this.refreshList();
    }, (error: ApiError) => {
      this.alertService.toast('Error occured, try again.');
    });
  }

  private getDeckName(name: string = ''): Promise<string | undefined> {
    const invalidValues = this.decks.map(d => d.name);
    return this.alertService.inputName({
      title: 'Enter deck name',
      placeholder: 'Deck name',
      invalidValues,
      value: name
    });
  }

}
