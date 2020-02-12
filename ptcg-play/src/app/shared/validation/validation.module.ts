import { NgModule } from '@angular/core';

import { EmailValidatorDirective } from './email.validator';
import { InvalidValueDirective } from './invalid-value.validator';
import { NameValidatorDirective } from './name.validator';
import { NumberValidatorDirective } from './number.validator';
import { PasswordMatchDirective } from './password-match.validator';
import { PasswordValidatorDirective } from './password.validator';

@NgModule({
  declarations: [
    EmailValidatorDirective,
    InvalidValueDirective,
    NameValidatorDirective,
    NumberValidatorDirective,
    PasswordMatchDirective,
    PasswordValidatorDirective
  ],
  exports: [
    EmailValidatorDirective,
    InvalidValueDirective,
    NameValidatorDirective,
    NumberValidatorDirective,
    PasswordMatchDirective,
    PasswordValidatorDirective
  ]
})
export class ValidationModule {}
