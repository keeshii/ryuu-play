import { Component, OnInit, Input } from '@angular/core';
import { Player, UserInfo, ReplayPlayer } from 'ptcg-server';
import { Observable, EMPTY } from 'rxjs';

import { SessionService } from '../../../shared/session/session.service';

@Component({
  selector: 'ptcg-player-bar',
  templateUrl: './player-bar.component.html',
  styleUrls: ['./player-bar.component.scss']
})
export class PlayerBarComponent implements OnInit {

  @Input() set player(player: Player) {
    this.refreshData(player, this.replayPlayerValue);
  }

  @Input() set replayPlayer(replayPlayer: ReplayPlayer) {
    if (this.replayPlayerValue !== replayPlayer) {
      this.refreshData(this.playerValue, replayPlayer);
    }
  }

  @Input() active: boolean;

  private replayPlayerValue: ReplayPlayer;
  private playerValue: Player;

  public isEmpty = true;
  public deckCount: number;
  public handCount: number;
  public discardCount: number;
  public name: string;
  public userInfo$: Observable<UserInfo | undefined> = EMPTY;

  constructor(
    private sessionService: SessionService
  ) { }

  ngOnInit() { }

  private refreshData(player: Player, replayPlayer: ReplayPlayer) {
    this.playerValue = player;
    this.replayPlayerValue = replayPlayer;

    this.isEmpty = !player;
    if (this.isEmpty) {
      return;
    }

    this.playerValue = player;
    this.deckCount = player.deck.cards.length;
    this.handCount = player.hand.cards.length;
    this.discardCount = player.discard.cards.length;
    this.name = player.name;

    this.userInfo$ = this.sessionService.get(session => {
      if (replayPlayer) {
        return session.users[replayPlayer.userId];
      }
      const client = session.clients.find(c => c.clientId === player.id);
      return client !== undefined ? session.users[client.userId] : undefined;
    });
  }

}
