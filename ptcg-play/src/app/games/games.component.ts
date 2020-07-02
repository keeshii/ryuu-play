import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameInfo, UserInfo } from 'ptcg-server';
import { Observable } from 'rxjs';

import { MainService } from '../api/services/main.service';
import { SessionService } from '../shared/session/session.service';
import { SocketService } from '../api/socket.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';
import { CardsBaseService } from '../shared/cards/cards-base.service';

@Component({
  selector: 'ptcg-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnDestroy, OnInit {
  title = 'ptcg-play';

  displayedColumns: string[] = ['id', 'turn', 'player1', 'player2', 'actions'];
  public users$: Observable<UserInfo[]>;
  public games$: Observable<GameInfo[]>;
  public isConnected = false;

  constructor(
    private mainSevice: MainService,
    private sessionService: SessionService,
    private socketService: SocketService,
    private cardsBaseService: CardsBaseService
  ) {
    this.users$ = this.sessionService.get(session => session.users);
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
    this.mainSevice.createGame();
  }

  public showCardInfo() {
    const card = this.cardsBaseService.getCardByName('Buizel GE');
    this.cardsBaseService.showCardInfo({ card });
  }

}
