import { Component, OnInit, Input } from '@angular/core';
import { DeckEditPane } from './deck-edit-pane.interface';

@Component({
  selector: 'ptcg-deck-edit-pane',
  templateUrl: './deck-edit-pane.component.html',
  styleUrls: ['./deck-edit-pane.component.scss']
})
export class DeckEditPaneComponent implements OnInit {

  @Input() type: DeckEditPane;

  constructor() { }

  ngOnInit() {
  }

}
