import { NgModule } from '@angular/core';

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
    RegisterComponent,
    ResetPasswordComponent,
    ServerPasswordPopupComponent
  ],
  entryComponents: [
    ServerPasswordPopupComponent
  ],
  providers: [
    ServerPasswordPopupService
  ],
  exports: [
    RegisterComponent,
    ResetPasswordComponent
  ]
})
export class LoginModule {}
