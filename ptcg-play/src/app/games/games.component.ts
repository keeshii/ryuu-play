import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameInfo, ClientInfo } from 'ptcg-server';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { CreateGamePopupComponent } from './create-game-popup/create-game-popup.component';
import { MainService } from '../api/services/main.service';
import { SessionService } from '../shared/session/session.service';
import { SocketService } from '../api/socket.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnDestroy, OnInit {
  title = 'ptcg-play';

  displayedColumns: string[] = ['id', 'turn', 'player1', 'player2', 'actions'];
  public users$: Observable<ClientInfo[]>;
  public games$: Observable<GameInfo[]>;
  public isConnected = false;

  constructor(
    private dialog: MatDialog,
    private mainSevice: MainService,
    private sessionService: SessionService,
    private socketService: SocketService
  ) {
    this.users$ = this.sessionService.get(session => session.clients);
    this.games$ = this.sessionService.get(session => session.games);
  }

  ngOnInit() {
    this.socketService.connection
      .pipe(takeUntilDestroyed(this))
      .subscribe(connected => {
        this.isConnected = connected;
      });
  }

  ngOnDestroy() { }

  public createGame() {
    const dialog = this.dialog.open(CreateGamePopupComponent, {
      maxWidth: '100%',
      width: '350px',
      data: { }
    });

    return dialog.afterClosed().toPromise()
      .then(result => {
        if (result) {
          this.mainSevice.createGame();
        }
      })
      .catch(() => false);
  }

}
