import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ReplayInfo, GameWinner } from 'ptcg-server';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil, map, finalize } from 'rxjs/operators';

import { AlertService } from '../shared/alert/alert.service';
import { ApiError } from '../api/api.error';
import { ReplayService } from '../api/services/replay.service';
import { ReplayListResponse, ReplaySearch } from '../api/interfaces/replay.interface';
import { SessionService } from '../shared/session/session.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';
import { environment } from '../../environments/environment';

@Component({
  selector: 'ptcg-ranking',
  templateUrl: './replays.component.html',
  styleUrls: ['./replays.component.scss']
})
export class ReplaysComponent implements OnInit, OnDestroy {

  public GameWinner = GameWinner;
  public displayedColumns: string[] = ['name', 'player1', 'player2', 'created', 'actions'];
  public replays: ReplayInfo[] = [];
  public loading = false;
  public searchValue: string;
  public pageIndex = 0;
  public pageSizeOptions: number[] = [];
  public pageSize: number;
  public rankingTotal: number;
  public loggedUserId: number;

  private replaysSearch$ = new Subject<ReplaySearch>();
  private searchValue$ = new Subject<string>();

  constructor(
    private alertService: AlertService,
    private replayService: ReplayService,
    private router: Router,
    private sessionService: SessionService
  ) {
    this.initPagination();
  }

  public ngOnInit() {

    this.sessionService.get(session => session.users)
      .pipe(takeUntilDestroyed(this))
      .subscribe({
        next: users => {
          this.replays.forEach(replay => {
            replay.player1 = users[replay.player1.userId] || replay.player1;
            replay.player2 = users[replay.player2.userId] || replay.player2;
          });
        }
      });

    this.sessionService.get(session => session.loggedUserId).pipe(
      takeUntilDestroyed(this)
    ).subscribe({
      next: loggedUserId => {
        this.loggedUserId = loggedUserId;
      }
    });

    this.replaysSearch$.pipe(
      takeUntilDestroyed(this),
      switchMap(search => {
        this.loading = true;
        return this.replayService.getList(search.page, search.query).pipe(
          takeUntil(this.replaysSearch$),
          takeUntilDestroyed(this),
          map(response => [search, response] as [ReplaySearch, ReplayListResponse])
        );
      }),
    ).subscribe({
      next: ([search, response]) => {
        this.loading = false;
        this.searchValue = search.query;
        this.pageIndex = search.page;
        this.replays = response.replays;
        this.rankingTotal = response.total;
      },
      error: (error: ApiError) => {
        this.loading = false;
        this.alertService.toast(error.code);
      }
    });

    this.searchValue$.pipe(
      takeUntilDestroyed(this),
      debounceTime(300)
    ).subscribe({
      next: query => {
        this.replaysSearch$.next({ page: 0, query });
      }
    });

    this.refreshList();
  }

  public ngOnDestroy() {
  }

  private initPagination() {
    let pageSize = environment.defaultPageSize;
    if (this.sessionService.session.config) {
      pageSize = this.sessionService.session.config.defaultPageSize;
    }
    this.pageSizeOptions = [ pageSize ];
    this.pageSize = pageSize;
  }

  public showReplay(replayId: number) {
    this.loading = true;
    this.replayService.getReplay(replayId)
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

  public async deleteReplay(replayId: number) {
    if (!await this.alertService.confirm('Delete the selected replay?')) {
      return;
    }
    this.loading = true;
    this.replayService.deleteReplay(replayId).pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this)
    ).subscribe(() => {
      this.refreshList();
    }, (error: ApiError) => {
      this.alertService.toast('Error occured, try again.');
    });
  }

  public async renameReplay(replayId: number, previousName: string) {
    const name = await this.getReplayName(previousName);
    if (name === undefined) {
      return;
    }

    this.loading = true;
    this.replayService.rename(replayId, name).pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this)
    ).subscribe(() => {
      this.refreshList();
    }, (error: ApiError) => {
      this.alertService.toast('Error occured, try again.');
    });
  }

  public onSearch(value: string) {
    this.loading = true;
    return value === ''
      ? this.replaysSearch$.next({ query: '', page: 0 })
      : this.searchValue$.next(value);
  }

  public onPageChange(event: PageEvent) {
    this.replaysSearch$.next({
      query: this.searchValue,
      page: event.pageIndex
    });
  }

  public importFromFile() {
  }

  private refreshList() {
    this.replaysSearch$.next({
      query: this.searchValue,
      page: this.pageIndex
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

}
