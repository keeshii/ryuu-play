import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { UserInfo } from '@ptcg/common';
import { Observable } from 'rxjs';

import { SessionService } from '../../session/session.service';


@Component({
  selector: 'ptcg-user-info-popup',
  templateUrl: './user-info-popup.component.html',
  styleUrls: ['./user-info-popup.component.scss']
})
export class UserInfoPopupComponent {

  public user: UserInfo;
  public userId: number;
  public visitor$: Observable<boolean>;

  constructor(
    private dialogRef: MatDialogRef<UserInfoPopupComponent>,
    private sessionService: SessionService,
    @Inject(MAT_DIALOG_DATA) data: { user: UserInfo },
  ) {
    this.user = data.user;
    this.userId = data.user.userId;

    this.visitor$ = this.sessionService.get(session => {
      return session.loggedUserId !== this.userId;
    });
  }

  public close() {
    this.dialogRef.close();
  }

}
