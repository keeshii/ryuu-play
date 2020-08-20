import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[ptcgInvalidValue][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: InvalidValueDirective, multi: true }]
})
export class InvalidValueDirective implements Validator {

  private control: AbstractControl;
  private invalidValue: string;

  @Input() set ptcgInvalidValue(value: string) {
    this.invalidValue = value;
    if (this.control) {
      this.control.updateValueAndValidity();
    }
  }

  validate(control: AbstractControl): ValidationErrors {
    this.control = control;
    const value = String(control.value || '').trim();

    if (value === this.invalidValue) {
      return {invalidValue: true};
    }

    return null;
  }

}
