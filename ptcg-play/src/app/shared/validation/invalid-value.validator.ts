import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[ptcgInvalidValue][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: InvalidValueDirective, multi: true }]
})
export class InvalidValueDirective implements Validator {

  @Input() ptcgInvalidValue: string;

  validate(control: AbstractControl): ValidationErrors {
    const value = String(control.value || '').trim();

    if (value === this.ptcgInvalidValue) {
      return {invalidValue: true};
    }

    return null;
  }

}
