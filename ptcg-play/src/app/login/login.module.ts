import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { LoginPopupComponent } from './login-popup/login-popup.component';
import { LoginPopupService } from './login-popup/login-popup.service';
import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ServerPasswordPopupComponent } from './server-password-popup/server-password-popup.component';
import { ServerPasswordPopupService } from './server-password-popup/server-password-popup.service';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    LoginPopupComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ServerPasswordPopupComponent,
    LoginComponent
  ],
  entryComponents: [
    LoginPopupComponent,
    ServerPasswordPopupComponent
  ],
  providers: [
    LoginPopupService,
    ServerPasswordPopupService
  ],
  exports: [
    RegisterComponent,
    ResetPasswordComponent
  ]
})
export class LoginModule {}
