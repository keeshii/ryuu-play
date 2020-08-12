import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvatarComponent } from './avatar/avatar.component';
import { BadgeComponent } from './badge/badge.component';
import { RankComponent } from './rank/rank.component';
import { UserBarComponent } from './user-bar/user-bar.component';

@NgModule({
  declarations: [
    AvatarComponent,
    BadgeComponent,
    RankComponent,
    UserBarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AvatarComponent,
    BadgeComponent,
    RankComponent,
    UserBarComponent
  ]
})
export class UserInfoModule { }
