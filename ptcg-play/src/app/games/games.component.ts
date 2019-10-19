import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameInfo, UserInfo } from 'ptcg-server';
import { Observable } from 'rxjs';

import { MainService } from '../api/services/main.service';
import { SocketService } from '../api/socket.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnDestroy, OnInit {
  title = 'ptcg-play';

  public users$: Observable<UserInfo[]>;
  public games$: Observable<GameInfo[]>;
  public isConnected = false;

  constructor(
    private mainSevice: MainService,
    private socketService: SocketService,
  ) {
    this.users$ = mainSevice.users$;
    this.games$ = mainSevice.games$;
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

}
