import { NgModule } from '@angular/core';

import { LoginPopupComponent } from './login-popup/login-popup.component';
import { LoginPopupService } from './login-popup/login-popup.service';
import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    LoginPopupComponent,
    RegisterComponent,
    ResetPasswordComponent
  ],
  entryComponents: [
    LoginPopupComponent
  ],
  exports: [
    RegisterComponent,
    ResetPasswordComponent
  ],
  providers: [
    LoginPopupService
  ]
})
export class LoginModule {}
