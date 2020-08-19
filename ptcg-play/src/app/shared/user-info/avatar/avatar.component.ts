import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {SessionService} from '../../session/session.service';

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

    const isBase64 = /^data:image\/([a-zA-Z]*);base64,/;
    const isFullUrl = /^(https?|file):\/\//;

    if (fileName.match(isBase64) || fileName.match(isFullUrl)) {
      this.imageUrl = fileName;
      return;
    }

    const config = this.sessionService.session.config;
    const url = config && config.avatarsUrl || '';
    this.imageUrl = url.replace('{name}', fileName);
  }

  @Input() hoverable: boolean;
  public imageUrl: string;

  constructor(private sessionService: SessionService) { }

  ngOnInit(): void {
  }

}
