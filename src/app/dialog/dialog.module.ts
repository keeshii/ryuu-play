import { NgModule } from '@angular/core';

import { LoginPopupComponent } from './login-popup/login-popup.component';
import { LoginService } from './login-popup/login.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    LoginPopupComponent
  ],
  entryComponents: [
    LoginPopupComponent
  ],
  providers: [
    LoginService
  ]
})
export class DialogModule {}
