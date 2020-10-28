import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { LoginPopupComponent } from './login-popup/login-popup.component';
import { LoginPopupService } from './login-popup/login-popup.service';
import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ServerPasswordPopupComponent } from './server-password-popup/server-password-popup.component';
import { ServerPasswordPopupService } from './server-password-popup/server-password-popup.service';
import { ChangeServerPopupComponent } from './change-server-popup/change-server-popup.component';
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ChangeServerPopupComponent,
    LoginPopupComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ServerPasswordPopupComponent,
    SetNewPasswordComponent,
    LoginComponent
  ],
  entryComponents: [
    ChangeServerPopupComponent,
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
