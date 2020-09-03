import { NgModule } from '@angular/core';

import { ReplaysComponent } from './replays.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ReplaysComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ReplaysModule { }
