import { Component, OnInit, Input } from '@angular/core';
import { Rank } from 'ptcg-server';

@Component({
  selector: 'ptcg-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.scss']
})
export class RankComponent implements OnInit {

  @Input() set rank(rank: Rank) {
    switch (rank) {
      case Rank.MASTER:
        this.rankColor = 'warn';
        this.rankName = 'Master';
        break;
      case Rank.SENIOR:
        this.rankColor = 'primary';
        this.rankName = 'Senior';
        break;
      case Rank.JUNIOR:
        this.rankColor = 'accent';
        this.rankName = 'Junior';
        break;
      default:
        this.rankColor = '';
        this.rankName = 'Unknown';
    }
  }

  @Input() ranking: number;
  public rankName: string;
  public rankColor: string;

  constructor() { }

  ngOnInit(): void {
  }

}
