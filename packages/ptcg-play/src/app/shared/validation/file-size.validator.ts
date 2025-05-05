import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors } from '@angular/forms';
import { FileInput } from '../file-input/file-input.model';

@Directive({
  selector: '[ptcgFileSizeValidator][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: FileSizeValidatorDirective, multi: true }]
})
export class FileSizeValidatorDirective implements Validator {

  private fileSize = 0;

  @Input()
  set maxFileSize(value: string) {
    this.fileSize = parseInt(value, 10);
  }

  validate(control: AbstractControl): ValidationErrors {
    if (!control || !control.value) {
      return null;
    }
    const fileInput: FileInput = control.value;
    if (!fileInput.files) {
      return null;
    }
    const size = fileInput.files.map(f => f.size).reduce((acc, i) => acc + i, 0);
    if (size <= this.fileSize) {
      return null;
    }
    return {
      maxFileSize: {
        actualSize: size,
        maxSize: this.fileSize
      }
    };
  }

}
