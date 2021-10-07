import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';

import { AlertService } from 'src/app/shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { AvatarService } from '../../api/services/avatar.service';
import { FileInput } from '../../shared/file-input/file-input.model';
import { SessionService } from '../../shared/session/session.service';
import { ApiErrorEnum } from 'ptcg-server';

@UntilDestroy()
@Component({
  selector: 'ptcg-add-avatar-popup',
  templateUrl: './add-avatar-popup.component.html',
  styleUrls: ['./add-avatar-popup.component.scss']
})
export class AddAvatarPopupComponent {

  public loading = false;
  public invalidName: string;
  public imageFile: FileInput;
  public name: string;
  public avatarError: string;
  public maxFileSize: number;
  public imageBase64: string;

  constructor(
    private alertService: AlertService,
    private avatarService: AvatarService,
    private dialogRef: MatDialogRef<AddAvatarPopupComponent>,
    private sessionService: SessionService,
    private translate: TranslateService
  ) {
    this.maxFileSize = this.sessionService.session.config.avatarFileSize;
  }

  public uploadImage(): void {
    this.loading = true;
    this.avatarService.addAvatar(this.name, this.imageBase64)
      .pipe(
        finalize(() => { this.loading = false; }),
        untilDestroyed(this)
      )
      .subscribe({
        next: response => {
          this.dialogRef.close(response.avatar);
        },
        error: (error: ApiError) => {
          switch (error.code) {
            case ApiErrorEnum.NAME_DUPLICATE:
              this.alertService.toast(this.translate.instant('ERROR_NAME_IN_USE'));
              break;
            default:
              if (!error.handled) {
                this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
              }
              break;
          }
        }
      });
  }

  public updatePreview(value: FileInput) {
    if (value === null || value.files.length === 0) {
      this.avatarError = '';
      this.imageBase64 = '';
      return;
    }

    const file = value.files[0];
    const url = URL.createObjectURL(file);

    // handled by different validator
    if (file.size > this.maxFileSize) {
      this.avatarError = '';
      this.imageBase64 = '';
      return;
    }

    const minSize = this.sessionService.session.config.avatarMinSize;
    const maxSize = this.sessionService.session.config.avatarMaxSize;

    this.loading = true;
    const image = new Image();
    image.onload = () => {
      if (image.width < minSize || image.height < minSize) {
        this.loading = false;
        this.avatarError = 'IMAGE_TOO_SMALL';
        return;
      }
      if (image.width > maxSize || image.height > maxSize) {
        this.loading = false;
        this.avatarError = 'IMAGE_TOO_BIG';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.loading = false;
        this.avatarError = '';
        this.imageBase64 = String(reader.result);
      };
      reader.onerror = () => {
        this.loading = false;
        this.avatarError = 'CANNOT_DECODE_IMAGE';
      };
      reader.readAsDataURL(file);
    };
    image.onerror = () => {
      this.loading = false;
      this.avatarError = 'CANNOT_DECODE_IMAGE';
    };
    image.src = url;
  }

}
