import { Component, OnInit, OnDestroy } from '@angular/core';
import { RankingInfo } from 'ptcg-server';
import { finalize } from 'rxjs/operators';

import { RankingService } from '../api/services/ranking.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';
import { ApiError } from '../api/api.error';

@Component({
  selector: 'ptcg-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = ['position', 'ranking', 'user', 'actions'];
  public ranking: RankingInfo[] = [];
  public loading = false;

  constructor(
    private rankingService: RankingService
  ) { }

  public ngOnInit() {
    this.refresh();
  }

  public ngOnDestroy() {
  }

  public onSearch(value: string) {
    return;
  }

  public refresh() {
    this.loading = true;
    this.rankingService.getList().pipe(
      finalize(() => { this.loading = false; }),
      takeUntilDestroyed(this)
    )
      .subscribe(response => {
        this.ranking = response.ranking;
      }, (error: ApiError) => { });
  }

}
