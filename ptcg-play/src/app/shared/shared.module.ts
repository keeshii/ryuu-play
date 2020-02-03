import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';

import { AlertPopupComponent } from './alert/alert-popup/alert-popup.component';
import { AlertService } from './alert/alert.service';
import { AppRoutingModule } from '../app-routing.module';
import { CardsModule } from './cards/cards.module';
import { ConfirmPopupComponent } from './alert/confirm-popup/confirm-popup.component';
import { ContentComponent } from './content/content.component';
import { EnergyComponent } from './energy/energy.component';
import { SessionService } from './session/session.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarContainerComponent } from './sidebar/sidebar-container.component';
import { ValidationModule } from './validation/validation.module';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    CardsModule,
    FormsModule,
    MaterialModule,
    ValidationModule
  ],
  declarations: [
    AlertPopupComponent,
    ConfirmPopupComponent,
    ContentComponent,
    EnergyComponent,
    SidebarComponent,
    SidebarContainerComponent
  ],
  entryComponents: [
    AlertPopupComponent,
    ConfirmPopupComponent
  ],
  exports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    CardsModule,
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
