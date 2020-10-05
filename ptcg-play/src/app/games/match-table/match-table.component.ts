import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatchInfo, GameWinner } from 'ptcg-server';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, switchMap, takeUntil, map } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { MatchHistoryResponse } from '../../api/interfaces/profile.interface';
import { ProfileService } from '../../api/services/profile.service';
import { ReplayService } from '../../api/services/replay.service';
import { SessionService } from '../../shared/session/session.service';
import { UserInfoMap } from '../../shared/session/session.interface';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ptcg-match-table',
  templateUrl: './match-table.component.html',
  styleUrls: ['./match-table.component.scss']
})
export class MatchTableComponent implements OnInit, OnDestroy {

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
    private sessionService: SessionService
  ) {
    this.initPagination();
  }

  ngOnInit(): void {
    this.sessionService.get(session => session.users)
      .pipe(takeUntilDestroyed(this))
      .subscribe({
        next: users => {
          this.users = users;
        }
      });

    this.matchesPageRequst$.pipe(
      takeUntilDestroyed(this),
      switchMap(page => {
        this.loading = true;
        return this.profileService.getMatchHistory(this.id, page).pipe(
          takeUntil(this.matchesPageRequst$),
          takeUntilDestroyed(this),
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
        this.alertService.toast(error.message);
      }
    });

    this.refresh();
  }

  ngOnDestroy(): void { }

  public showReplay(matchId: number): void {
    this.loading = true;
    this.replayService.getMatchReplay(matchId)
      .pipe(
        finalize(() => { this.loading = false; }),
        takeUntilDestroyed(this)
      )
      .subscribe({
        next: gameState => {
          if (gameState !== undefined) {
            this.router.navigate(['/table', gameState.localId]);
          }
        },
        error: (error: ApiError) => {
          this.alertService.toast(error.message);
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
      takeUntilDestroyed(this)
    ).subscribe(() => {
      this.alertService.toast('Replay saved.');
    }, (error: ApiError) => {
      this.alertService.toast('Error occured, try again.');
    });
  }

  private getReplayName(name: string = ''): Promise<string | undefined> {
    return this.alertService.inputName({
      title: 'Enter replay name',
      placeholder: 'Replay name',
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