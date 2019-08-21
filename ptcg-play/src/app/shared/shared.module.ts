import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';

import { ContentComponent } from './content/content.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarContainerComponent } from './sidebar/sidebar-container.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MaterialModule
  ],
  declarations: [
    ContentComponent,
    SidebarComponent,
    SidebarContainerComponent
  ],
  exports: [
    BrowserAnimationsModule,
    ContentComponent,
    MaterialModule,
    SidebarComponent,
    SidebarContainerComponent
  ]
})
export class SharedModule {}
