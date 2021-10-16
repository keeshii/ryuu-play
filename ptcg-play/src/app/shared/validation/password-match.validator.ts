import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[ptcgPasswordMatchValidator][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordMatchDirective, multi: true }]
})
export class PasswordMatchDirective implements Validator {

  @Input() ptcgPasswordMatchValidator: string;

  validate(control: AbstractControl): ValidationErrors {
    const value = String(control.value || '');

    if (value !== this.ptcgPasswordMatchValidator) {
      return {passwordMatch: true};
    }

    return null;
  }

}
