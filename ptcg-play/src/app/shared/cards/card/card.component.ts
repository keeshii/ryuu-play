import { Component, OnInit, Input } from '@angular/core';
import { Card } from 'ptcg-server';

import { CardsBaseService } from '../cards-base.service';

@Component({
  selector: 'ptcg-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  exportAs: 'ptcgCard'
})
export class CardComponent implements OnInit {

  public scanUrl: string;
  public data: Card;

  @Input() cardback = false;

  @Input() placeholder = false;

  @Input() set card(value: Card) {
    this.data = value;
    this.scanUrl = this.cardsBaseService.getScanUrl(this.data);
  }

  constructor(
    private cardsBaseService: CardsBaseService,
  ) { }

  ngOnInit() { }

}
