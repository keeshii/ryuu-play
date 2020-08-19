import { NgModule } from '@angular/core';

import { EmailValidatorDirective } from './email.validator';
import { ErrorValidatorDirective } from './error.validator';
import { FileSizeValidatorDirective } from './file-size.validator';
import { InvalidValueDirective } from './invalid-value.validator';
import { NameValidatorDirective } from './name.validator';
import { NumberValidatorDirective } from './number.validator';
import { PasswordMatchDirective } from './password-match.validator';
import { PasswordValidatorDirective } from './password.validator';

@NgModule({
  declarations: [
    EmailValidatorDirective,
    ErrorValidatorDirective,
    FileSizeValidatorDirective,
    InvalidValueDirective,
    NameValidatorDirective,
    NumberValidatorDirective,
    PasswordMatchDirective,
    PasswordValidatorDirective
  ],
  exports: [
    EmailValidatorDirective,
    ErrorValidatorDirective,
    FileSizeValidatorDirective,
    InvalidValueDirective,
    NameValidatorDirective,
    NumberValidatorDirective,
    PasswordMatchDirective,
    PasswordValidatorDirective
  ]
})
export class ValidationModule {}
