import { Component } from '@angular/core';
import { GameState } from 'ptcg-server';
import { Observable } from 'rxjs';

import { SessionService } from '../../shared/session/session.service';

@Component({
  selector: 'ptcg-sidenav',
  exportAs: 'ptcgSidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  public gameStates$: Observable<GameState[]>;
  public unreadMessages$: Observable<number>;

  constructor(
    private sessionService: SessionService,
  ) {
    this.gameStates$ = this.sessionService.get(session => session.gameStates);

    this.unreadMessages$ = this.sessionService.get(session => {
      let unread = 0;
      session.conversations.forEach(c => {
        const message = c.lastMessage;
        if (message.senderId !== session.loggedUserId && !message.isRead) {
          unread += 1;
        }
      });
      return unread;
    });

  }

}
