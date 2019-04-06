import { NgModule } from '@angular/core';

import { DeckComponent } from './deck.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DeckComponent
  ],
  imports: [
    SharedModule
  ],
  providers: []
})
export class DeckModule { }
