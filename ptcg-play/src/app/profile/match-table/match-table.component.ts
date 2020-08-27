import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatchInfo, GameWinner } from 'ptcg-server';
import { SessionService } from 'src/app/shared/session/session.service';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { ProfileService } from '../../api/services/profile.service';
import { UserInfoMap } from '../../shared/session/session.interface';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-match-table',
  templateUrl: './match-table.component.html',
  styleUrls: ['./match-table.component.scss']
})
export class MatchTableComponent implements OnInit, OnDestroy {

  public GameWinner = GameWinner;
  public displayedColumns: string[] = ['id', 'player1', 'player2', 'ranking', 'actions'];
  public matches: MatchInfo[] = [];
  public id: number;
  public loading = false;
  public loadingFailed = false;
  public users: UserInfoMap;

  @Input() set userId(userId: number) {
    this.id = userId;
    this.loadMatches(userId);
  }

  constructor(
    private alertService: AlertService,
    private profileService: ProfileService,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.sessionService.get(session => session.users)
      .pipe(takeUntilDestroyed(this))
      .subscribe({
        next: users => {
          this.users = users;
        }
      });
  }

  ngOnDestroy(): void { }

  public loadMatches(userId: number) {
    this.loading = true;
    this.loadingFailed = false;
    return this.profileService.getMatchHistory(userId)
      .pipe(
        finalize(() => { this.loading = false; }),
        takeUntilDestroyed(this)
      )
      .subscribe({
        next: matchHistoryResponse => {
          const users = { ...this.sessionService.session.users };
          matchHistoryResponse.users.forEach(u => users[u.userId] = u);
          this.sessionService.set({ users });
          this.matches = matchHistoryResponse.matches;
        },
        error: (error: ApiError) => {
          this.loadingFailed = true;
          this.alertService.toast(error.message);
        }
      });
  }

}
