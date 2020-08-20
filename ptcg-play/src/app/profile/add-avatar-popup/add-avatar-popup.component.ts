import { Component, OnInit, OnDestroy } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AlertService } from 'src/app/shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { AvatarService } from '../../api/services/avatar.service';
import { FileInput } from '../../shared/file-input/file-input.model';
import { SessionService } from '../../shared/session/session.service';
import { takeUntilDestroyed } from '../../shared/operators/take-until-destroyed';

@Component({
  selector: 'ptcg-add-avatar-popup',
  templateUrl: './add-avatar-popup.component.html',
  styleUrls: ['./add-avatar-popup.component.scss']
})
export class AddAvatarPopupComponent implements OnInit, OnDestroy {

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
    private sessionService: SessionService
  ) {
    this.maxFileSize = this.sessionService.session.config.avatarFileSize;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  public uploadImage(): void {
    this.loading = true;
    this.avatarService.addAvatar(this.name, this.imageBase64)
      .pipe(
        finalize(() => { this.loading = false; }),
        takeUntilDestroyed(this)
      )
      .subscribe({
        next: response => {
          console.log('response', response);
        },
        error: (error: ApiError) => {
          this.alertService.toast(error.message);
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
