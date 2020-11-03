import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AvatarComponent } from './avatar/avatar.component';
import { AvatarPopupComponent } from './avatar-popup/avatar-popup.component';
import { BadgeComponent } from './badge/badge.component';
import { MaterialModule } from '../material.module';
import { RankComponent } from './rank/rank.component';
import { UserBarComponent } from './user-bar/user-bar.component';
import { UserInfoPaneComponent } from './user-info-pane/user-info-pane.component';
import { UserInfoPopupComponent } from './user-info-popup/user-info-popup.component';

@NgModule({
  declarations: [
    AvatarComponent,
    AvatarPopupComponent,
    BadgeComponent,
    RankComponent,
    UserBarComponent,
    UserInfoPaneComponent,
    UserInfoPopupComponent
  ],
  entryComponents: [
    AvatarPopupComponent,
    UserInfoPopupComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    TranslateModule
  ],
  exports: [
    AvatarComponent,
    BadgeComponent,
    RankComponent,
    UserBarComponent,
    UserInfoPaneComponent
  ]
})
export class UserInfoModule { }
