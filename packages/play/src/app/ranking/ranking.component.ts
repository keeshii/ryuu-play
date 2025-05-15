import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { RankingInfo } from '@ptcg/common';
import { Subject, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, switchMap, takeUntil, map } from 'rxjs/operators';

import { AlertService } from '../shared/alert/alert.service';
import { ApiError } from '../api/api.error';
import { RankingService } from '../api/services/ranking.service';
import { RankingResponse, RankingSearch } from '../api/interfaces/ranking.interface';
import { SessionService } from '../shared/session/session.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'ptcg-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  public displayedColumns: string[] = ['position', 'ranking', 'user', 'actions'];
  public ranking: RankingInfo[] = [];
  public loading = false;
  public searchValue: string;
  public pageIndex = 0;
  public pageSizeOptions: number[] = [];
  public pageSize: number;
  public rankingTotal: number;
  public loggedUserId: number;

  private rankingSearch$ = new Subject<RankingSearch>();
  private searchValue$ = new Subject<string>();
  private destroyRef = inject(DestroyRef);

  constructor(
    private alertService: AlertService,
    private rankingService: RankingService,
    private sessionService: SessionService,
    private translate: TranslateService
  ) {
    this.initPagination();
  }

  public ngOnInit() {

    this.sessionService.get(session => session.loggedUserId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: loggedUserId => {
        this.loggedUserId = loggedUserId;
      }
    });

    this.rankingSearch$.pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(search => {
        this.loading = true;
        return this.rankingService.getList(search.page, search.query).pipe(
          takeUntil(this.rankingSearch$),
          takeUntilDestroyed(this.destroyRef),
          map(response => [search, response] as [RankingSearch, RankingResponse])
        );
      }),
    ).subscribe({
      next: ([search, response]) => {
        this.loading = false;
        this.searchValue = search.query;
        this.pageIndex = search.page;
        this.ranking = response.ranking;
        this.rankingTotal = response.total;
        this.updateSessionUsers(response.ranking);
      },
      error: (error: ApiError) => {
        this.loading = false;
        if (!error.handled) {
          this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
        }
      }
    });

    this.searchValue$.pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(query => of(query).pipe(
        delay(300),
        takeUntil(this.rankingSearch$)
      ))
    ).subscribe({
      next: query => {
        this.rankingSearch$.next({ page: 0, query });
      }
    });

    this.refresh();
  }

  private initPagination() {
    let pageSize = environment.defaultPageSize;
    if (this.sessionService.session.config) {
      pageSize = this.sessionService.session.config.defaultPageSize;
    }
    this.pageSizeOptions = [ pageSize ];
    this.pageSize = pageSize;
  }

  private updateSessionUsers(ranking: RankingInfo[]) {
    const users = this.sessionService.session.users;
    for (const row of ranking) {
      users[row.user.userId] = row.user;
    }
    this.sessionService.set({ users });
  }

  public onSearch(value: string) {
    this.loading = true;
    return value === ''
      ? this.rankingSearch$.next({ query: '', page: 0 })
      : this.searchValue$.next(value);
  }

  public onPageChange(event: PageEvent) {
    this.rankingSearch$.next({
      query: this.searchValue,
      page: event.pageIndex
    });
  }

  public refresh() {
    this.rankingSearch$.next({
      query: this.searchValue,
      page: this.pageIndex
    });
  }

}
