import { NgModule } from '@angular/core';

import { GamesComponent } from './games.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    GamesComponent
  ],
  imports: [
    SharedModule
  ],
  providers: []
})
export class GamesModule { }
