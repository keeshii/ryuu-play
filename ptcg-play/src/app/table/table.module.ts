import { NgModule } from '@angular/core';

import { BoardModule } from './board/board.module';
import { SharedModule } from '../shared/shared.module';
import { TableComponent } from './table.component';
import { HandComponent } from './hand/hand.component';

@NgModule({
  declarations: [
    TableComponent,
    HandComponent,
  ],
  imports: [
    BoardModule,
    SharedModule
  ],
  providers: []
})
export class TableModule { }
