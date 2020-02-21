import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerBarComponent } from './player-bar/player-bar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableSidebarComponent } from './table-sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    TableSidebarComponent,
    PlayerBarComponent
  ],
  exports: [
    TableSidebarComponent
  ]
})
export class TableSidebarModule { }
