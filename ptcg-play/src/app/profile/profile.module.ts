import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile.component';
import { MatchTableComponent } from './match-table/match-table.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ProfileComponent,
    MatchTableComponent
  ],
  exports: [
  ]
})
export class ProfileModule {}
