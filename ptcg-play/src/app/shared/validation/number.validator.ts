import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[ptcgNumberValidator][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: NumberValidatorDirective, multi: true }]
})
export class NumberValidatorDirective implements Validator {

  @Input() ptcgNumberValidatorMin: number;
  @Input() ptcgNumberValidatorMax: number;

  validate(control: AbstractControl): ValidationErrors {
    const value = String(control.value === undefined ? '' : control.value).trim();

    if (!value.match(/^\d+$/)) {
      return {numberInvalid: true};
    }

    const numberValue = parseInt(value, 10);
    const min = this.ptcgNumberValidatorMin;
    const max = this.ptcgNumberValidatorMax;

    if (min !== undefined && min > numberValue) {
      return {numberMin: true};
    }

    if (max !== undefined && max < numberValue) {
      return {numberMin: true};
    }

    return null;
  }

}
