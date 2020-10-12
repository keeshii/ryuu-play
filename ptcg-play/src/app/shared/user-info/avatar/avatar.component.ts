import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from '../../../api/api.service';
import { AvatarPopupComponent } from '../avatar-popup/avatar-popup.component';
import { SessionService } from '../../session/session.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ptcg-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  @Input() set avatarFile(fileName: string) {
    this.avatarFileValue = fileName;

    if (!fileName) {
      this.imageUrl = '';
      return;
    }

    const base64pattern = /^data:image\/([a-zA-Z]*);base64,/;
    const urlPattern = /^(https?|file):\/\//;

    if (fileName.match(base64pattern) || fileName.match(urlPattern)) {
      this.imageUrl = fileName;
      return;
    }

    const config = this.sessionService.session.config;
    const avatarUrl = config && config.avatarsUrl || '';

    const apiUrl = this.apiService.getApiUrl();
    this.imageUrl = apiUrl + avatarUrl
      .replace('{name}', fileName);
  }

  @Input() hoverable: boolean;
  @Input() openAvatarPopup: boolean;
  private avatarFileValue: string;
  public imageUrl: string;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
  }

  showAvatarPopup() {
    const avatarFile = this.avatarFileValue;
    const dialog = this.dialog.open(AvatarPopupComponent, {
      maxWidth: '100%',
      data: { avatarFile }
    });

    return dialog.afterClosed().toPromise()
      .catch(() => false);
  }

}
