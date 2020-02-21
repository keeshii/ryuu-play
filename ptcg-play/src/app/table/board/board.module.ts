import { NgModule } from '@angular/core';

import { BoardComponent } from './board.component';
import { BoardPrizesComponent } from './board-prizes/board-prizes.component';
import { BoardBenchComponent } from './board-bench/board-bench.component';
import { BoardActiveComponent } from './board-active/board-active.component';
import { BoardDeckComponent } from './board-deck/board-deck.component';
import { BoardCardComponent } from './board-card/board-card.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    BoardComponent,
    BoardPrizesComponent,
    BoardBenchComponent,
    BoardActiveComponent,
    BoardDeckComponent,
    BoardCardComponent
  ],
  exports: [
    BoardComponent,
    BoardCardComponent
  ]
})
export class BoardModule { }
