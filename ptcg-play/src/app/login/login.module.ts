import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    RegisterComponent,
    ResetPasswordComponent
  ],
  exports: [
    RegisterComponent,
    ResetPasswordComponent
  ]
})
export class LoginModule {}
