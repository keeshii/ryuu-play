import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ApiModule } from './api/api.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
    AppRoutingModule,
    BrowserModule,
    DeckModule,
    GamesModule,
    LoginModule,
    ProfileModule,
    SharedModule,
    TableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
