import { Component, OnInit, Input } from '@angular/core';

import { CardEntry } from '../../../api/interfaces/cards.interface';
import { CardsBaseService } from '../cards-base.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ptcg-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  public scanUrl: string;

  @Input() set card(value: string) {
    this.data = this.cardsBaseService.getCardByName(value);
    const uri = this.cardsBaseService.scansUrl.replace('{name}', this.data.fullName);
    this.scanUrl = environment.apiUrl + uri;
  }

  public data: CardEntry;

  constructor(private cardsBaseService: CardsBaseService) { }

  ngOnInit() { }

}
