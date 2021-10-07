import { Component } from '@angular/core';
import { GameInfo, UserInfo } from 'ptcg-server';
import { Observable } from 'rxjs';

import { SessionService } from '../../shared/session/session.service';

@Component({
  selector: 'ptcg-games-table',
  templateUrl: './games-table.component.html',
  styleUrls: ['./games-table.component.scss']
})
export class GamesTableComponent {

  public displayedColumns: string[] = ['id', 'player1', 'player2', 'prizes', 'turn', 'actions'];
  public games$: Observable<{ game: GameInfo, users: UserInfo[] }[]>;

  constructor(
    private sessionService: SessionService
  ) {
    this.games$ = this.sessionService.get(session => {
      return session.games.map(game => {
        const users = game.players.map(player => {
          const client = session.clients.find(c => c.clientId === player.clientId);
          return client ? session.users[client.userId] : undefined;
        });
        return { game, users };
      });
    });
  }

}
