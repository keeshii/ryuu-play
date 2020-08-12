import { Component, OnInit } from '@angular/core';
import { GameWinner, UserInfo } from 'ptcg-server';
import { Rank } from 'ptcg-server';

export interface MatchInfo {
  matchId: number;
  replayId: number;
  player1: string;
  player2: string;
  userId1: number;
  userId2: number;
  winner: GameWinner;
}

@Component({
  selector: 'ptcg-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  displayedColumns: string[] = ['id', 'player1', 'player2', 'result', 'actions'];

  user: UserInfo;
  
  matches: MatchInfo[] = [];

  constructor() {
    this.user = {
      clientIds: [1],
      userId: 1,
      name: 'kamil',
      email: 'kamil@email',
      ranking: 1024,
      rank: Rank.MASTER,
      avatarFile: ''
    };
  }

  ngOnInit(): void {
  }

}
