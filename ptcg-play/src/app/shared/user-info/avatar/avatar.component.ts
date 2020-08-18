import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'ptcg-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  @Input() avatarFile: string;

  @Input() hoverable: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
