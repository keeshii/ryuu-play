import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { UserInfo } from '@ryuu-play/ptcg-server';

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
