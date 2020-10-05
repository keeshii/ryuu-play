import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerBarComponent } from './player-bar/player-bar.component';
import { ProfileModule } from 'src/app/profile/profile.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableSidebarComponent } from './table-sidebar.component';
import { PlayerActionsComponent } from './player-actions/player-actions.component';
import { GameLogsComponent } from './game-logs/game-logs.component';
import { ReplayControlsComponent } from './replay-controls/replay-controls.component';
import { ChooseAvatarPopupComponent } from './choose-avatar-popup/choose-avatar-popup.component';
import { PlayerAvatarComponent } from './player-avatar/player-avatar.component';
import { PlayerTimeComponent } from './player-time/player-time.component';

@NgModule({
  imports: [
    CommonModule,
    ProfileModule,
    SharedModule
  ],
  declarations: [
    ChooseAvatarPopupComponent,
    GameLogsComponent,
    PlayerActionsComponent,
    PlayerAvatarComponent,
    PlayerBarComponent,
    ReplayControlsComponent,
    TableSidebarComponent,
    PlayerTimeComponent
  ],
  entryComponents: [
    ChooseAvatarPopupComponent
  ],
  exports: [
    TableSidebarComponent
  ]
})
export class TableSidebarModule { }
