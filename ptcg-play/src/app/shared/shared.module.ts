import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';

import { AlertService } from './alert/alert.service';
import { ContentComponent } from './content/content.component';
import { EnergyComponent } from './energy/energy.component';
import { SessionService } from './session/session.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarContainerComponent } from './sidebar/sidebar-container.component';
import { ValidationModule } from './validation/validation.module';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    ValidationModule
  ],
  declarations: [
    ContentComponent,
    EnergyComponent,
    SidebarComponent,
    SidebarContainerComponent
  ],
  exports: [
    BrowserAnimationsModule,
    ContentComponent,
    EnergyComponent,
    FormsModule,
    MaterialModule,
    SidebarComponent,
    SidebarContainerComponent,
    ValidationModule
  ],
  providers: [
    AlertService,
    SessionService
  ]
})
export class SharedModule {}
