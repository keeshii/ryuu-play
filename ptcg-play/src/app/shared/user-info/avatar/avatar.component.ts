import { Component, OnInit, Input } from '@angular/core';

import { SessionService } from '../../session/session.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ptcg-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  @Input() set avatarFile(fileName: string) {
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

    this.imageUrl = environment.apiUrl + avatarUrl
      .replace('{name}', fileName);
  }

  @Input() hoverable: boolean;
  public imageUrl: string;

  constructor(private sessionService: SessionService) { }

  ngOnInit(): void {
  }

}
