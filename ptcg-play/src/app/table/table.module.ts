import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { TableComponent } from './table.component';
import { BoardComponent } from './board/board.component';
import { HandComponent } from './hand/hand.component';
import { BoardPrizesComponent } from './board-prizes/board-prizes.component';
import { BoardBenchComponent } from './board-bench/board-bench.component';
import { BoardActiveComponent } from './board-active/board-active.component';
import { BoardDeckComponent } from './board-deck/board-deck.component';
import { BoardCardComponent } from './board-card/board-card.component';

@NgModule({
  declarations: [
    TableComponent,
    BoardComponent,
    HandComponent,
    BoardPrizesComponent,
    BoardBenchComponent,
    BoardActiveComponent,
    BoardDeckComponent,
    BoardCardComponent
  ],
  imports: [
    SharedModule
  ],
  providers: []
})
export class TableModule { }
