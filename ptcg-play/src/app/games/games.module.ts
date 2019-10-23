import { NgModule } from '@angular/core';

import { GameComponent } from './game/game.component';
import { GamesComponent } from './games.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    GameComponent,
    GamesComponent
  ],
  imports: [
    SharedModule
  ],
  providers: []
})
export class GamesModule { }
