import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

export interface InputNamePopupData {
  title?: string;
  message?: string;
  placeholder?: string;
  invalidValues?: string[];
  value?: string;
}

@Component({
  selector: 'ptcg-input-name-popup',
  templateUrl: './input-name-popup.component.html',
  styleUrls: ['./input-name-popup.component.scss']
})
export class InputNamePopupComponent {

  public title: string;
  public message: string;
  public placeholder: string;
  public invalidValues: string[];
  public invalidValue: string;
  public value: string;
  public initialValue: string;

  constructor(
    private dialogRef: MatDialogRef<InputNamePopupComponent>,
    translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) data: InputNamePopupData,
  ) {
    const DEFAULT_TITLE = translate.instant('ALERT_NAME_TITLE');

    this.title = data.title || DEFAULT_TITLE;
    this.message = data.message;
    this.placeholder = data.placeholder || DEFAULT_TITLE;
    this.value = String(data.value) || '';
    this.initialValue = this.value;
    this.invalidValues = data.invalidValues || [];
  }

  public confirm() {
    const value = this.value.trim();
    if (value === '') {
      return this.cancel();
    }
    if (value === this.initialValue) {
      return this.cancel();
    }
    if (this.invalidValues.includes(value)) {
      this.invalidValue = value;
      return;
    }
    this.dialogRef.close(value);
  }

  public cancel() {
    this.dialogRef.close();
  }

}
