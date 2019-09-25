import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors } from '@angular/forms';

const emailPattern = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;

@Directive({
  selector: '[ptcgEmailValidator][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: EmailValidatorDirective, multi: true }]
})
export class EmailValidatorDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors {
    const value: string = control.value || '';

    if (value.length > 128) {
      return {email: true};
    }

    return emailPattern.test(value) ? null : {email: true};
  }

}
