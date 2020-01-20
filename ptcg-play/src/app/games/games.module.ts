import { NgModule } from '@angular/core';

import { GameComponent } from './game/game.component';
import { GamesComponent } from './games.component';
import { SharedModule } from '../shared/shared.module';
import { PlayerInfoComponent } from './player-info/player-info.component';
import { GameActionsComponent } from './game-actions/game-actions.component';

@NgModule({
  declarations: [
    GameComponent,
    GamesComponent,
    PlayerInfoComponent,
    GameActionsComponent
  ],
  imports: [
    SharedModule
  ],
  providers: []
})
export class GamesModule { }
