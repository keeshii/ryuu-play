import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SidenavItemComponent } from './sidenav-item/sidenav-item.component';
import { LanguageSelectComponent } from './language-select/language-select.component';



@NgModule({
  declarations: [
    SidenavComponent,
    ToolbarComponent,
    SidenavItemComponent,
    LanguageSelectComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    SidenavComponent,
    ToolbarComponent
  ]
})
export class MainModule { }
