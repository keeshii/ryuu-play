import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Card } from 'ptcg-server';
import { DragSource, SkyhookDndService } from '@angular-skyhook/core';

import { CardsBaseService } from '../cards-base.service';
import { environment } from '../../../../environments/environment';

export const DraggableType = 'CARD';

@Component({
  selector: 'ptcg-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  exportAs: 'ptcgCard'
})
export class CardComponent implements OnInit, OnDestroy {

  public cardSource: DragSource<{card: Card}, any>;
  public scanUrl: string;
  public data: Card;

  @Input() canDrag = true;

  @Input() set card(value: Card) {
    this.data = value;
    const uri = this.cardsBaseService.scansUrl.replace('{name}', this.data.fullName);
    this.scanUrl = environment.apiUrl + uri;
  }

  constructor(
    private cardsBaseService: CardsBaseService,
    private dnd: SkyhookDndService
  ) {
    this.cardSource = this.dnd.dragSource(DraggableType, {
      beginDrag: () => ({ card: this.data }),
      canDrag: () => this.canDrag
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.cardSource.unsubscribe();
  }

}
