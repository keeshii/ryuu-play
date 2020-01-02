import { NgModule } from '@angular/core';

import { ProfileMenuComponent } from './profile-menu/profile-menu.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ProfileMenuComponent
  ],
  exports: [
    ProfileMenuComponent
  ]
})
export class ProfileModule {}
