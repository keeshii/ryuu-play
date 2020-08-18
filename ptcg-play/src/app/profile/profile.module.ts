import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile.component';
import { MatchTableComponent } from './match-table/match-table.component';
import { EditAvatarsPopupComponent } from './edit-avatars-popup/edit-avatars-popup.component';
import { AddAvatarPopupComponent } from './add-avatar-popup/add-avatar-popup.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    AddAvatarPopupComponent,
    EditAvatarsPopupComponent,
    MatchTableComponent,
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
