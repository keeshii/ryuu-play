import { Component, OnInit } from '@angular/core';
import { MatchInfo } from 'ptcg-server';

@Component({
  selector: 'ptcg-match-table',
  templateUrl: './match-table.component.html',
  styleUrls: ['./match-table.component.scss']
})
export class MatchTableComponent implements OnInit {

  public displayedColumns: string[] = ['id', 'player1', 'player2', 'result', 'actions'];
  public matches: MatchInfo[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
