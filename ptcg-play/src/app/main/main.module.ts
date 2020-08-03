import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';



@NgModule({
  declarations: [
    SidenavComponent,
    ToolbarComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ToolbarComponent
  ]
})
export class MainModule { }
