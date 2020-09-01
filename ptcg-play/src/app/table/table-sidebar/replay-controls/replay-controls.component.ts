import { Component, OnInit, Input } from '@angular/core';

import { LocalGameState } from '../../../shared/session/session.interface';

@Component({
  selector: 'ptcg-replay-controls',
  templateUrl: './replay-controls.component.html',
  styleUrls: ['./replay-controls.component.scss']
})
export class ReplayControlsComponent implements OnInit {

  @Input() gameState: LocalGameState;

  constructor() { }

  ngOnInit(): void {
  }

  public showInfo(): void {
  }

}
