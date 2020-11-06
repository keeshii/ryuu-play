import { NgModule } from '@angular/core';

import { GamesComponent } from './games.component';
import { MatchTableComponent } from './match-table/match-table.component';
import { SharedModule } from '../shared/shared.module';
import { GameActionsComponent } from './game-actions/game-actions.component';
import { CreateGamePopupComponent } from './create-game-popup/create-game-popup.component';
import { GamesTableComponent } from './games-table/games-table.component';

@NgModule({
  declarations: [
    GamesComponent,
    GameActionsComponent,
    MatchTableComponent,
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
