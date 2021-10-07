import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { RankingInfo } from 'ptcg-server';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, switchMap, takeUntil, map } from 'rxjs/operators';

import { AlertService } from '../shared/alert/alert.service';
import { ApiError } from '../api/api.error';
import { RankingService } from '../api/services/ranking.service';
import { RankingResponse, RankingSearch } from '../api/interfaces/ranking.interface';
import { SessionService } from '../shared/session/session.service';
import { environment } from '../../environments/environment';

@UntilDestroy()
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
      untilDestroyed(this)
    ).subscribe({
      next: loggedUserId => {
        this.loggedUserId = loggedUserId;
      }
    });

    this.rankingSearch$.pipe(
      untilDestroyed(this),
      switchMap(search => {
        this.loading = true;
        return this.rankingService.getList(search.page, search.query).pipe(
          takeUntil(this.rankingSearch$),
          untilDestroyed(this),
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
      untilDestroyed(this),
      debounceTime(300)
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
