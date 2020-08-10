import { Component, OnInit, Input } from '@angular/core';
import { LocalGameState } from '../../shared/session/session.service';

@Component({
  selector: 'ptcg-sidenav-item',
  templateUrl: './sidenav-item.component.html',
  styleUrls: ['./sidenav-item.component.scss']
})
export class SidenavItemComponent implements OnInit {

  @Input() gameState: LocalGameState;

  constructor() { }

  ngOnInit(): void {
  }

  onClose(event: MouseEvent) {
    event.stopPropagation();
  }

}
