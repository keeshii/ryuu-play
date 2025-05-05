import { NgModule } from '@angular/core';

import { GamesModule } from '../games/games.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile.component';
import { EditAvatarsPopupComponent } from './edit-avatars-popup/edit-avatars-popup.component';
import { AddAvatarPopupComponent } from './add-avatar-popup/add-avatar-popup.component';
import { ChangeEmailPopupComponent } from './change-email-popup/change-email-popup.component';
import { ChangePasswordPopupComponent } from './change-password-popup/change-password-popup.component';

@NgModule({
    imports: [
        SharedModule,
        GamesModule,
    ],
    declarations: [
        AddAvatarPopupComponent,
        ChangeEmailPopupComponent,
        ChangePasswordPopupComponent,
        EditAvatarsPopupComponent,
        ProfileComponent
    ],
    exports: []
})
export class ProfileModule {}
