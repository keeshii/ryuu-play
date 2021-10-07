import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { DndModule } from '@ng-dnd/core';
import { DndMultiBackendModule, MultiBackend, HTML5ToTouch } from '@ng-dnd/multi-backend';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { ApiModule } from './api/api.module';
import { AppComponent } from './app.component';
import { DeckModule } from './deck/deck.module';
import { GamesModule } from './games/games.module';
import { LanguageService } from './main/language-select/language.service';
import { LoginModule } from './login/login.module';
import { MainModule } from './main/main.module';
import { MessagesModule } from './messages/messages.module';
import { ProfileModule } from './profile/profile.module';
import { RankingModule } from './ranking/ranking.module';
import { ReplaysModule } from './replays/replays.module';
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
    MainModule,
    MessagesModule,
    ProfileModule,
    RankingModule,
    ReplaysModule,
    SharedModule,
    DndMultiBackendModule,
    DndModule.forRoot({ backend: MultiBackend, options: HTML5ToTouch }),
    TableModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: ( createTranslateLoader ),
        deps: [ HttpClient ]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(languageService: LanguageService) {
    languageService.chooseLanguage();
  }
}

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
