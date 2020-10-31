import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { SkyhookDndModule } from '@angular-skyhook/core';
import { MultiBackend, HTML5ToTouch } from '@angular-skyhook/multi-backend';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';

import { ApiModule } from './api/api.module';
import { AppComponent } from './app.component';
import { CardsBaseService } from './shared/cards/cards-base.service';
import { DeckModule } from './deck/deck.module';
import { GamesModule } from './games/games.module';
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
    SkyhookDndModule.forRoot({ backend: MultiBackend, options: HTML5ToTouch }),
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
  constructor(translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    let browserLang = translate.getBrowserLang();

    // decode borser language, strip format 'en-US' to 'en'
    if (browserLang !== undefined && browserLang.match(/\w\w/i) !== null) {
      browserLang = browserLang.match(/\w\w/i)[0].toLowerCase();
      translate.use(browserLang);
    }
  }
}

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
