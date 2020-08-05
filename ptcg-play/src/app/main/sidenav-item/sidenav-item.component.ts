import { Component, OnInit, Input } from '@angular/core';
import { GameState } from 'ptcg-server';

@Component({
  selector: 'ptcg-sidenav-item',
  templateUrl: './sidenav-item.component.html',
  styleUrls: ['./sidenav-item.component.scss']
})
export class SidenavItemComponent implements OnInit {

  @Input() gameState: GameState;

  constructor() { }

  ngOnInit(): void {
  }

  onClose(event: MouseEvent) {
    event.stopPropagation();
  }

}
