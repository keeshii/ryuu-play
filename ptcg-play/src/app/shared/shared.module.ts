import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { SkyhookDndModule } from '@angular-skyhook/core';
import { SkyhookMultiBackendModule } from '@angular-skyhook/multi-backend';
import { SkyhookSortableModule } from '@angular-skyhook/sortable';

import { AlertModule } from './alert/alert.module';
import { AppRoutingModule } from '../app-routing.module';
import { BadgeComponent } from './badge/badge.component';
import { CardsModule } from './cards/cards.module';
import { ContentComponent } from './content/content.component';
import { EnergyComponent } from './cards/energy/energy.component';
import { InfoComponent } from './info/info.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { SessionService } from './session/session.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarContainerComponent } from './sidebar/sidebar-container.component';
import { ValidationModule } from './validation/validation.module';

@NgModule({
  imports: [
    AlertModule,
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
    BadgeComponent,
    ContentComponent,
    InfoComponent,
    SearchBoxComponent,
    SidebarComponent,
    SidebarContainerComponent
  ],
  exports: [
    AlertModule,
    AppRoutingModule,
    BadgeComponent,
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
    SessionService
  ]
})
export class SharedModule {}
