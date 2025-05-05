import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ptcg-alert-popup',
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.scss']
})
export class AlertPopupComponent {

  public title: string;
  public message: string;

  constructor(
    private dialogRef: MatDialogRef<AlertPopupComponent>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) data: { title?: string, message: string },
  ) {
    this.title = data.title || this.translate.instant('ALERT_MESSAGE_TITLE');
    this.message = data.message;
  }

  public confirm() {
    this.dialogRef.close();
  }

}
