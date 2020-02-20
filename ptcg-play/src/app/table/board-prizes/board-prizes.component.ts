import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ptcg-board-prizes',
  templateUrl: './board-prizes.component.html',
  styleUrls: ['./board-prizes.component.scss']
})
export class BoardPrizesComponent implements OnInit {

  public prizeItems = [1, 2, 3, 4, 5, 6];

  constructor() { }

  ngOnInit() {
  }

}
