import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvatarComponent } from './avatar/avatar.component';
import { AvatarPopupComponent } from './avatar-popup/avatar-popup.component';
import { BadgeComponent } from './badge/badge.component';
import { MaterialModule } from '../material.module';
import { RankComponent } from './rank/rank.component';
import { UserBarComponent } from './user-bar/user-bar.component';

@NgModule({
  declarations: [
    AvatarComponent,
    AvatarPopupComponent,
    BadgeComponent,
    RankComponent,
    UserBarComponent
  ],
  entryComponents: [
    AvatarPopupComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    AvatarComponent,
    BadgeComponent,
    RankComponent,
    UserBarComponent
  ]
})
export class UserInfoModule { }
