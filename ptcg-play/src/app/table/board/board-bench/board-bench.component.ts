import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Player, PokemonCardList } from 'ptcg-server';

const BENCH_ITEMS = 5;

@Component({
  selector: 'ptcg-board-bench',
  templateUrl: './board-bench.component.html',
  styleUrls: ['./board-bench.component.scss']
})
export class BoardBenchComponent implements OnInit, OnChanges {

  @Input() player: Player;
  @Input() clientId: number;

  public bench: PokemonCardList[] = new Array(BENCH_ITEMS);
  public isOwner: boolean;

  constructor() { }

  ngOnInit() { }

  ngOnChanges() {
    if (this.player) {
      this.bench = this.player.bench;
      this.isOwner = this.player.id === this.clientId;
    } else {
      this.bench = new Array(BENCH_ITEMS);
      this.isOwner = false;
    }
  }

}
