import { Component, OnInit } from '@angular/core';
import { GameState } from 'ptcg-server';
import { Observable } from 'rxjs';

import { SessionService } from '../../shared/session/session.service';

@Component({
  selector: 'ptcg-sidenav',
  exportAs: 'ptcgSidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  public gameStates$: Observable<GameState[]>;

  constructor(
    private sessionService: SessionService,
  ) {
    this.gameStates$ = this.sessionService.get(session => session.gameStates);
  }

  ngOnInit(): void {
  }

}
