import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserInfo } from 'ptcg-server';

import { UserInfoPopupComponent } from './user-info-popup.component';

@Injectable({
  providedIn: 'root'
})
export class UserInfoPopupService {

  constructor(
    private dialog: MatDialog
  ) { }

  public showUserInfo(user: UserInfo): Promise<void> {
    const dialog = this.dialog.open(UserInfoPopupComponent, {
      maxWidth: '100%',
      width: '650px',
      data: { user }
    });

    return dialog.afterClosed().toPromise()
      .catch(() => undefined);
  }
}
