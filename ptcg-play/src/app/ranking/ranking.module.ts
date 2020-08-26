import { NgModule } from '@angular/core';

import { RankingComponent } from './ranking.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    RankingComponent
  ],
  imports: [
    SharedModule
  ]
})
export class RankingModule { }
