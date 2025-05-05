import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[ptcgNameValidator][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: NameValidatorDirective, multi: true }]
})
export class NameValidatorDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors {
    const value = String(control.value || '').trim();

    if (value.length < 3 || value.length > 32) {
      return {name: true};
    }

    return null;
  }

}
