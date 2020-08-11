import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ProfileComponent
  ],
  exports: [
  ]
})
export class ProfileModule {}
