import { Component, OnInit, Input } from '@angular/core';
import { Card } from 'ptcg-server';

@Component({
  selector: 'ptcg-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.scss']
})
export class BoardCardComponent implements OnInit {

  @Input() card: Card;

  constructor() { }

  ngOnInit() {
  }

}
