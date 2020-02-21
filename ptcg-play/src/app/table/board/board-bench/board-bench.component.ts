import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ptcg-board-bench',
  templateUrl: './board-bench.component.html',
  styleUrls: ['./board-bench.component.scss']
})
export class BoardBenchComponent implements OnInit {

  public benchItems = [1, 2, 3, 4, 5];

  constructor() { }

  ngOnInit() {
  }

}
