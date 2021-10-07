import { Component, Input } from '@angular/core';
import { UserInfo } from 'ptcg-server';

@Component({
  selector: 'ptcg-user-info-pane',
  templateUrl: './user-info-pane.component.html',
  styleUrls: ['./user-info-pane.component.scss']
})
export class UserInfoPaneComponent {

  @Input() user: UserInfo;

  constructor() { }

}
