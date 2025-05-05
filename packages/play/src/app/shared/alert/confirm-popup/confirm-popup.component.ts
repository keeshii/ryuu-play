import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ptcg-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent {

  public title: string;
  public message: string;

  constructor(
    private dialogRef: MatDialogRef<ConfirmPopupComponent>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) data: { title?: string, message: string },
  ) {
    this.title = data.title || this.translate.instant('ALERT_CONFIRM_TITLE');
    this.message = data.message;
  }

  public confirm() {
    this.dialogRef.close(true);
  }

  public cancel() {
    this.dialogRef.close(false);
  }

}
