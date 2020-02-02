import { NgModule } from '@angular/core';

import { DeckComponent } from './deck.component';
import { SharedModule } from '../shared/shared.module';
import { DeckNamePopupComponent } from './deck-name-popup/deck-name-popup.component';
import { DeckNamePopupService } from './deck-name-popup/deck-name-popup.service';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    DeckComponent,
    DeckNamePopupComponent
  ],
  entryComponents: [
    DeckNamePopupComponent
  ],
  providers: [
    DeckNamePopupService
  ]
})
export class DeckModule { }
