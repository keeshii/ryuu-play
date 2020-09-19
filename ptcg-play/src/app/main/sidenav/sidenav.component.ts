import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameState } from 'ptcg-server';
import { Observable } from 'rxjs';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { MessageService } from '../../api/services/message.service';
import { SessionService } from '../../shared/session/session.service';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-sidenav',
  exportAs: 'ptcgSidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {

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

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
