import { NgModule } from '@angular/core';

import { GameComponent } from './game/game.component';
import { GamesComponent } from './games.component';
import { MatchTableComponent } from './match-table/match-table.component';
import { SharedModule } from '../shared/shared.module';
import { PlayerInfoComponent } from './player-info/player-info.component';
import { GameActionsComponent } from './game-actions/game-actions.component';
import { CreateGamePopupComponent } from './create-game-popup/create-game-popup.component';
import { GamesTableComponent } from './games-table/games-table.component';

@NgModule({
  declarations: [
    GameComponent,
    GamesComponent,
    GameActionsComponent,
    MatchTableComponent,
    PlayerInfoComponent,
    CreateGamePopupComponent,
    GamesTableComponent
  ],
  entryComponents: [
    CreateGamePopupComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    MatchTableComponent
  ],
  providers: []
})
export class GamesModule { }
