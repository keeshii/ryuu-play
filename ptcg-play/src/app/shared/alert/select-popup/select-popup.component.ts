import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

export interface SelectPopupOption<T> {
  value: T;
  viewValue: string;
}

export interface SelectPopupData<T> {
  title?: string;
  message?: string;
  placeholder?: string;
  options?: SelectPopupOption<T>[];
  value?: T;
}

@Component({
  selector: 'ptcg-select-popup',
  templateUrl: './select-popup.component.html',
  styleUrls: ['./select-popup.component.scss']
})
export class SelectPopupComponent {

  public title: string;
  public message: string;
  public placeholder: string;
  public options: SelectPopupOption<any>[];
  public value: any;

  constructor(
    private dialogRef: MatDialogRef<SelectPopupComponent>,
    translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) data: SelectPopupData<any>,
  ) {
    const DEFAULT_TITLE = translate.instant('ALERT_SELECT_TITLE');

    this.title = data.title || DEFAULT_TITLE;
    this.message = data.message;
    this.placeholder = data.placeholder || DEFAULT_TITLE;
    this.value = data.value;
    this.options = data.options || [];
  }

  public confirm() {
    if (this.value === undefined) {
      return this.cancel();
    }
    this.dialogRef.close(this.value);
  }

  public cancel() {
    this.dialogRef.close();
  }

}
