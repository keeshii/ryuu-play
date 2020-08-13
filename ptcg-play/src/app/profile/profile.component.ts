import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameWinner, UserInfo, Rank } from 'ptcg-server';
import { switchMap } from 'rxjs/operators';

import { AlertService } from '../shared/alert/alert.service';
import { ProfileService } from '../api/services/profile.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';

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
export class ProfileComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['id', 'player1', 'player2', 'result', 'actions'];
  public user: UserInfo;
  public matches: MatchInfo[] = [];
  public loading: boolean;

  constructor(
    private alertService: AlertService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router
  ) {
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
    this.route.paramMap.pipe(
      switchMap(paramMap => {
        this.loading = true;
        const userId = parseInt(paramMap.get('userId'), 10);
        return this.profileService.getUser(userId);
      }),
      takeUntilDestroyed(this)
    )
      .subscribe(response => {
        this.loading = false;
        this.user = response.user;
      }, async error => {
        await this.alertService.error('Error while loading the profile');
        this.router.navigate(['/decks']);
      });
  }

  ngOnDestroy() {}

}
