import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatchInfo } from 'ptcg-server';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { ProfileService } from '../../api/services/profile.service';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-match-table',
  templateUrl: './match-table.component.html',
  styleUrls: ['./match-table.component.scss']
})
export class MatchTableComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = ['id', 'player1', 'player2', 'result', 'actions'];
  public matches: MatchInfo[] = [];
  public id: number;
  public loading = false;
  public loadingFailed = false;

  @Input() set userId(userId: number) {
    this.id = userId;
    this.loadMatches(userId);
  }

  constructor(
    private alertService: AlertService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void { }

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
          this.matches = matchHistoryResponse.matches;
        },
        error: (error: ApiError) => {
          this.loadingFailed = true;
          this.alertService.toast(error.message);
        }
      });
  }

}
