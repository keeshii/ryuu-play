import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { SkyhookDndModule } from '@angular-skyhook/core';
import { SkyhookMultiBackendModule } from '@angular-skyhook/multi-backend';
import { SkyhookSortableModule } from '@angular-skyhook/sortable';
import { TranslateModule } from '@ngx-translate/core';

import { AlertModule } from './alert/alert.module';
import { AppRoutingModule } from '../app-routing.module';
import { CardsModule } from './cards/cards.module';
import { ContentComponent } from './content/content.component';
import { EnergyComponent } from './cards/energy/energy.component';
import { FileInputComponent } from './file-input/file-input.component';
import { InfoComponent } from './info/info.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { SessionService } from './session/session.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarContainerComponent } from './sidebar/sidebar-container.component';
import { UserInfoModule } from './user-info/user-info.module';
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
    TranslateModule,
    UserInfoModule,
    ValidationModule
  ],
  declarations: [
    ContentComponent,
    FileInputComponent,
    InfoComponent,
    SearchBoxComponent,
    SidebarComponent,
    SidebarContainerComponent
  ],
  exports: [
    AlertModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CardsModule,
    ContentComponent,
    EnergyComponent,
    FileInputComponent,
    InfoComponent,
    FormsModule,
    MaterialModule,
    SearchBoxComponent,
    SidebarComponent,
    SidebarContainerComponent,
    SkyhookDndModule,
    SkyhookMultiBackendModule,
    SkyhookSortableModule,
    TranslateModule,
    UserInfoModule,
    ValidationModule
  ],
  providers: [
    SessionService
  ]
})
export class SharedModule {}
