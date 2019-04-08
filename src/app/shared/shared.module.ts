import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';

import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarContainerComponent } from './sidebar/sidebar-container.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MaterialModule
  ],
  declarations: [
    SidebarComponent,
    SidebarContainerComponent
  ],
  exports: [
    BrowserAnimationsModule,
    MaterialModule,
    SidebarComponent,
    SidebarContainerComponent
  ]
})
export class SharedModule {}
