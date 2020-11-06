import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

export interface InputNumberPopupData {
  title?: string;
  message?: string;
  placeholder?: string;
  minValue?: number;
  maxValue?: number;
  value?: number;
}

@Component({
  selector: 'ptcg-input-number-popup',
  templateUrl: './input-number-popup.component.html',
  styleUrls: ['./input-number-popup.component.scss']
})
export class InputNumberPopupComponent {

  public title: string;
  public message: string;
  public placeholder: string;
  public min: number;
  public max: number;
  public value: string;

  constructor(
    private dialogRef: MatDialogRef<InputNumberPopupComponent>,
    translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) data: InputNumberPopupData,
  ) {
    const DEFAULT_TITLE = translate.instant('ALERT_NUMBER_TITLE');

    this.title = data.title || DEFAULT_TITLE;
    this.message = data.message;
    this.placeholder = data.placeholder || DEFAULT_TITLE;
    this.value = String(data.value) || '';
    this.min = data.minValue;
    this.max = data.maxValue;
  }

  public confirm() {
    if (this.value === '') {
      return this.cancel();
    }
    this.dialogRef.close(parseInt(this.value, 10));
  }

  public cancel() {
    this.dialogRef.close();
  }

}
