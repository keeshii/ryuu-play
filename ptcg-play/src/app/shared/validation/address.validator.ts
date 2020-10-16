import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors } from '@angular/forms';

const addressPattern = /^https?:\/\/[a-z0-9]+(\.[a-z0-9]+)*(:[0-9]+)?$/;

@Directive({
  selector: '[ptcgAddressValidator][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: AddressValidatorDirective, multi: true }]
})
export class AddressValidatorDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors {
    const value: string = control.value;
    return addressPattern.test(value) ? null : {address: true};
  }

}
