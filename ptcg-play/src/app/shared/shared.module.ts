import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';

import { AlertService } from './alert/alert.service';
import { ContentComponent } from './content/content.component';
import { LoginPopupComponent } from './login-popup/login-popup.component';
import { LoginPopupService } from './login-popup/login-popup.service';
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
    LoginPopupComponent,
    SidebarComponent,
    SidebarContainerComponent
  ],
  entryComponents: [
    LoginPopupComponent
  ],
  exports: [
    BrowserAnimationsModule,
    ContentComponent,
    FormsModule,
    MaterialModule,
    SidebarComponent,
    SidebarContainerComponent,
    ValidationModule
  ],
  providers: [
    AlertService,
    LoginPopupService,
    SessionService
  ]
})
export class SharedModule {}
