import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[ptcgPasswordValidator][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordValidatorDirective, multi: true }]
})
export class PasswordValidatorDirective implements Validator {

  private length = 5;

  @Input('password-min-length')
  set setLength(value: string) {
    this.length = parseInt(value, 10);
  }

  validate(control: AbstractControl): ValidationErrors {
    const value = String(control.value || '').trim();

    if (value.length < this.length || value.length > 32) {
      return {password: true};
    }

    return null;
  }

}
