import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SkyhookDndModule } from '@angular-skyhook/core';
import { default as HTML5Backend } from 'react-dnd-html5-backend';

import { ApiModule } from './api/api.module';
import { AppComponent } from './app.component';
import { CardsBaseService } from './shared/cards/cards-base.service';
import { DeckModule } from './deck/deck.module';
import { GamesModule } from './games/games.module';
import { LoginModule } from './login/login.module';
import { ProfileModule } from './profile/profile.module';
import { SharedModule } from './shared/shared.module';
import { TableModule } from './table/table.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ApiModule,
    BrowserModule,
    DeckModule,
    GamesModule,
    LoginModule,
    ProfileModule,
    SharedModule,
    SkyhookDndModule.forRoot({ backend: HTML5Backend }),
    TableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(cardsBaseService: CardsBaseService) {
    cardsBaseService.loadCards();
  }
}
