import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { TableComponent } from './table.component';

@NgModule({
  declarations: [
    TableComponent
  ],
  imports: [
    SharedModule
  ],
  providers: []
})
export class TableModule { }
