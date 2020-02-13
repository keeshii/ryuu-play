import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { SkyhookDndModule } from '@angular-skyhook/core';
import { SkyhookMultiBackendModule } from '@angular-skyhook/multi-backend';
import { SkyhookSortableModule } from '@angular-skyhook/sortable';

import { AlertPopupComponent } from './alert/alert-popup/alert-popup.component';
import { AlertService } from './alert/alert.service';
import { AppRoutingModule } from '../app-routing.module';
import { CardsModule } from './cards/cards.module';
import { ConfirmPopupComponent } from './alert/confirm-popup/confirm-popup.component';
import { ContentComponent } from './content/content.component';
import { EnergyComponent } from './energy/energy.component';
import { InfoComponent } from './info/info.component';
import { InputNumberPopupComponent } from './alert/input-number-popup/input-number-popup.component';
import { SearchBoxComponent } from './search-box/search-box.component';
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
    SkyhookDndModule,
    SkyhookMultiBackendModule,
    SkyhookSortableModule,
    ValidationModule
  ],
  declarations: [
    AlertPopupComponent,
    ConfirmPopupComponent,
    ContentComponent,
    EnergyComponent,
    InfoComponent,
    InputNumberPopupComponent,
    SearchBoxComponent,
    SidebarComponent,
    SidebarContainerComponent
  ],
  entryComponents: [
    AlertPopupComponent,
    ConfirmPopupComponent,
    InputNumberPopupComponent
  ],
  exports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    CardsModule,
    ContentComponent,
    EnergyComponent,
    InfoComponent,
    FormsModule,
    MaterialModule,
    SearchBoxComponent,
    SidebarComponent,
    SidebarContainerComponent,
    SkyhookDndModule,
    SkyhookMultiBackendModule,
    SkyhookSortableModule,
    ValidationModule
  ],
  providers: [
    AlertService,
    SessionService
  ]
})
export class SharedModule {}
