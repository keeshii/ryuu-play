import { Directive, Input, Optional, Host } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors, NgModel } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';

@Directive({
  selector: '[ptcgErrorValidator][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ErrorValidatorDirective, multi: true }]
})
export class ErrorValidatorDirective implements Validator {

  private error: string;
  private control: AbstractControl;

  @Input() set ptcgErrorValue(value: string) {
    this.error = value;
    if (this.control) {
      this.control.updateValueAndValidity();
    }
  }

  validate(control: AbstractControl): ValidationErrors {
    this.control = control;
    if (this.error) {
      return { ptcgError: this.error };
    }
    return null;
  }

}
