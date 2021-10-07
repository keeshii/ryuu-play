import { Component, OnInit, Input } from '@angular/core';
import { MatchInfo, GameWinner } from 'ptcg-server';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, switchMap, takeUntil, map } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { MatchHistoryResponse } from '../../api/interfaces/profile.interface';
import { ProfileService } from '../../api/services/profile.service';
import { ReplayService } from '../../api/services/replay.service';
import { SessionService } from '../../shared/session/session.service';
import { UserInfoMap } from '../../shared/session/session.interface';
import { environment } from '../../../environments/environment';

@UntilDestroy()
@Component({
  selector: 'ptcg-match-table',
  templateUrl: './match-table.component.html',
  styleUrls: ['./match-table.component.scss']
})
export class MatchTableComponent implements OnInit {

  public GameWinner = GameWinner;
  public displayedColumns: string[] = ['id', 'player1', 'player2', 'date', 'actions'];
  public matches: MatchInfo[] = [];
  public id = 0;
  public loading = false;
  public loadingFailed = false;
  public users: UserInfoMap;
  public pageIndex = 0;
  public pageSizeOptions: number[] = [];
  public pageSize: number;
  public matchesTotal: number;
  private matchesPageRequst$ = new Subject<number>();

  @Input() set userId(userId: number) {
    this.id = userId;
    this.displayedColumns = userId !== 0
      ? ['id', 'player1', 'player2', 'date', 'ranking', 'actions']
      : ['id', 'player1', 'player2', 'date', 'actions'];

    this.refresh();
  }

  constructor(
    private alertService: AlertService,
    private profileService: ProfileService,
    private replayService: ReplayService,
    private router: Router,
    private sessionService: SessionService,
    private translate: TranslateService
  ) {
    this.initPagination();
  }

  ngOnInit(): void {
    this.sessionService.get(session => session.users)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: users => {
          this.users = users;
        }
      });

    this.matchesPageRequst$.pipe(
      untilDestroyed(this),
      switchMap(page => {
        this.loading = true;
        return this.profileService.getMatchHistory(this.id, page).pipe(
          takeUntil(this.matchesPageRequst$),
          untilDestroyed(this),
          map(response => [page, response] as [number, MatchHistoryResponse])
        );
      }),
    ).subscribe({
      next: ([page, response]) => {
        this.loading = false;
        this.pageIndex = page;
        this.matches = response.matches;
        this.matchesTotal = response.total;
        const users = { ...this.sessionService.session.users };
        response.users.forEach(u => users[u.userId] = u);
        this.sessionService.set({ users });
      },
      error: (error: ApiError) => {
        this.loading = false;
        this.loadingFailed = true;
        this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
      }
    });

    this.refresh();
  }

  public showReplay(matchId: number): void {
    this.loading = true;
    this.replayService.getMatchReplay(matchId)
      .pipe(
        finalize(() => { this.loading = false; }),
        untilDestroyed(this)
      )
      .subscribe({
        next: gameState => {
          if (gameState !== undefined) {
            this.router.navigate(['/table', gameState.localId]);
          }
        },
        error: (error: ApiError) => {
          this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
        }
      });
  }

  public async saveReplay(matchId: number) {
    const name = await this.getReplayName();
    if (name === undefined) {
      return;
    }

    this.loading = true;
    this.replayService.saveMatch(matchId, name).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    ).subscribe(() => {
      this.alertService.toast(this.translate.instant('REPLAY_SAVED'));
    }, (error: ApiError) => {
      if (!error.handled) {
        this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
      }
    });
  }

  private getReplayName(name: string = ''): Promise<string | undefined> {
    return this.alertService.inputName({
      title: this.translate.instant('REPLAY_ENTER_NAME'),
      placeholder: this.translate.instant('REPLAY_NAME'),
      invalidValues: [],
      value: name
    });
  }

  private initPagination() {
    let pageSize = environment.defaultPageSize;
    if (this.sessionService.session.config) {
      pageSize = this.sessionService.session.config.defaultPageSize;
    }
    this.pageSizeOptions = [ pageSize ];
    this.pageSize = pageSize;
  }

  public onPageChange(event: PageEvent) {
    this.matchesPageRequst$.next(event.pageIndex);
  }

  public refresh() {
    this.matchesPageRequst$.next(this.pageIndex);
  }

}
