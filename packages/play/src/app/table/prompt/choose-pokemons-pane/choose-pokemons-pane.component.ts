import { Component, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { PlayerType, Card } from '@ptcg/common';
import { DraggedItem } from '@ng-dnd/sortable';
import { DropTarget, DndService } from '@ng-dnd/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { PromptItem, PromptCardType } from '../prompt-card-item.interface';
import { PokemonData, PokemonItem, PokemonRow } from './pokemon-data';

type DropTargetType = DropTarget<DraggedItem<PromptItem>, any>;

interface PokemonDropItem {
  pokemonItem: PokemonItem;
  target: DropTargetType;
  highlight$: Observable<boolean>;
}

interface PokemonDropRow {
  pokemonRow: PokemonRow;
  items: PokemonDropItem[];
}

@Component({
  selector: 'ptcg-choose-pokemons-pane',
  templateUrl: './choose-pokemons-pane.component.html',
  styleUrls: ['./choose-pokemons-pane.component.scss']
})
export class ChoosePokemonsPaneComponent implements OnDestroy {

  public PlayerType = PlayerType;

  @Input() set pokemonData(pokemonData: PokemonData) {
    this.unsubscribeDropTargets();
    this.rows = this.buildDropTargets(pokemonData.getRows());
  }

  @Output() cardClick = new EventEmitter<PokemonItem>();
  @Output() cardDrop = new EventEmitter<[PokemonItem, Card]>();

  public rows: PokemonDropRow[];

  constructor(
    private cardsBaseService: CardsBaseService,
    private dnd: DndService
  ) { }

  private buildDropTargets(pokemonRows: PokemonRow[]): PokemonDropRow[] {
    const rows: PokemonDropRow[] = [];
    pokemonRows.forEach(pokemonRow => {
      const row: PokemonDropRow = { pokemonRow, items: [] };
      pokemonRow.items.forEach(pokemonItem => {
        const [target, highlight$] = this.initDropTarget(pokemonItem);
        row.items.push({ pokemonItem, target, highlight$ });
      });
      rows.push(row);
    });
    return rows;
  }

  private unsubscribeDropTargets() {
    if (this.rows) {
      this.rows.forEach(row => {
        row.items.forEach(item => item.target.unsubscribe());
      });
    }
  }

  private initDropTarget(item: PokemonItem): [DropTargetType, Observable<boolean>]  {
    const dropTarget: DropTargetType = this.dnd.dropTarget([PromptCardType], {
      canDrop: () => {
        return item.pokemonSlot.pokemons.cards.length > 0;
      },
      drop: monitor => {
        const card = monitor.getItem().data.card;
        this.cardDrop.next([item, card]);
      }
    });

    const dropState = dropTarget.listen(monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }));

    const highlight$: Observable<boolean> = dropState.pipe(map(state => state.canDrop && state.isOver));

    return [ dropTarget, highlight$ ];
  }

  public onCardClick(item: PokemonItem) {
    this.cardClick.emit(item);
  }

  public onBadgeClick(event: MouseEvent, item: PokemonItem) {
    event.stopPropagation();
    const pokemonSlot = item.pokemonSlot;
    const card = pokemonSlot.getPokemonCard();
    this.cardsBaseService.showCardInfo({ card, cardList: pokemonSlot.pokemons });
  }

  ngOnDestroy() {
    this.unsubscribeDropTargets();
  }

}
