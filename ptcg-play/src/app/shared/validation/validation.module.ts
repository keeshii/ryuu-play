import { NgModule } from '@angular/core';

import { EmailValidatorDirective } from './email.validator';
import { NameValidatorDirective } from './name.validator';

@NgModule({
  declarations: [
    EmailValidatorDirective,
    NameValidatorDirective,
  ],
  exports: [
    EmailValidatorDirective,
    NameValidatorDirective,
  ]
})
export class ValidationModule {}
