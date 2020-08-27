import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { RankingInfo } from 'ptcg-server';
import { Subject, Observable } from 'rxjs';
import { debounceTime, switchMap, takeUntil, map } from 'rxjs/operators';

import { AlertService } from '../shared/alert/alert.service';
import { ApiError } from '../api/api.error';
import { RankingService } from '../api/services/ranking.service';
import { RankingResponse, RankingSearch } from '../api/interfaces/ranking.interface';
import { SessionService } from '../shared/session/session.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';
import { environment } from '../../environments/environment';

@Component({
  selector: 'ptcg-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit, OnDestroy {

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
    private sessionService: SessionService
  ) {
    this.initPagination();
  }

  public ngOnInit() {

    this.sessionService.get(session => session.loggedUserId).pipe(
      takeUntilDestroyed(this)
    ).subscribe({
      next: loggedUserId => {
        this.loggedUserId = loggedUserId;
      }
    });

    this.rankingSearch$.pipe(
      takeUntilDestroyed(this),
      switchMap(search => {
        this.loading = true;
        return this.rankingService.getList(search.page, search.query).pipe(
          takeUntil(this.rankingSearch$),
          takeUntilDestroyed(this),
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
        this.rankingSearch$.next({ page: 0, query });
      }
    });

    this.refresh();
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
