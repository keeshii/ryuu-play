import { NgModule } from '@angular/core';

import { BoardModule } from './board/board.module';
import { HandComponent } from './hand/hand.component';
import { PromptModule } from './prompt/prompt.module';
import { SharedModule } from '../shared/shared.module';
import { TableComponent } from './table.component';
import { TableSidebarModule } from './table-sidebar/table-sidebar.module';

@NgModule({
  declarations: [
    TableComponent,
    HandComponent,
  ],
  imports: [
    BoardModule,
    PromptModule,
    SharedModule,
    TableSidebarModule
  ],
  providers: []
})
export class TableModule { }
