import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[ptcgPlayerNameValidator][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PlayerNameValidatorDirective, multi: true }]
})
export class PlayerNameValidatorDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors {
    const value = String(control.value || '');

    if (!value.match(/^[a-zA-Z0-9]{3,32}$/)) {
      return {name: true};
    }

    return null;
  }

}
