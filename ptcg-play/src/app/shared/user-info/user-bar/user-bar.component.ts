import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserInfo } from 'ptcg-server';

import { UserInfoPopupComponent } from '../user-info-popup/user-info-popup.component';

@Component({
  selector: 'ptcg-user-bar',
  templateUrl: './user-bar.component.html',
  styleUrls: ['./user-bar.component.scss']
})
export class UserBarComponent implements OnInit {

  @Input() user: UserInfo;
  @Input() marked = false;
  @Input() openUserPopup: boolean;

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  public showUserInfoPopup(user: UserInfo) {
    if (!this.openUserPopup || !this.user.userId) {
      return;
    }

    const dialog = this.dialog.open(UserInfoPopupComponent, {
      maxWidth: '100%',
      width: '650px',
      data: { user }
    });

    return dialog.afterClosed().toPromise()
      .catch(() => undefined);
  }

}
