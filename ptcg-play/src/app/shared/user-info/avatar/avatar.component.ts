import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ptcg-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  @Input() avatarFile: string;

  constructor() { }

  ngOnInit(): void {
  }

}
