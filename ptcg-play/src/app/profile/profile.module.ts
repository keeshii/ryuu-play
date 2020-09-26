import { NgModule } from '@angular/core';

import { GamesModule } from '../games/games.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile.component';
import { EditAvatarsPopupComponent } from './edit-avatars-popup/edit-avatars-popup.component';
import { AddAvatarPopupComponent } from './add-avatar-popup/add-avatar-popup.component';

@NgModule({
  imports: [
    SharedModule,
    GamesModule,
  ],
  declarations: [
    AddAvatarPopupComponent,
    EditAvatarsPopupComponent,
    ProfileComponent
  ],
  entryComponents: [
    AddAvatarPopupComponent,
    EditAvatarsPopupComponent
  ],
  exports: [
  ]
})
export class ProfileModule {}
