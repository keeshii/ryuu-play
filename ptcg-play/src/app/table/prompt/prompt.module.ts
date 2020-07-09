import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromptComponent } from './prompt.component';
import { PromptConfirmComponent } from './prompt-confirm/prompt-confirm.component';
import { PromptAlertComponent } from './prompt-alert/prompt-alert.component';
import { SharedModule } from '../../shared/shared.module';
import { PromptChooseCardsComponent } from './prompt-choose-cards/prompt-choose-cards.component';
import { CardsContainerComponent } from './cards-container/cards-container.component';
import { ChooseCardsPanesComponent } from './choose-cards-panes/choose-cards-panes.component';
import { PromptChooseEnergyComponent } from './prompt-choose-energy/prompt-choose-energy.component';
import { PromptChoosePrizeComponent } from './prompt-choose-prize/prompt-choose-prize.component';


@NgModule({
  declarations: [
    PromptComponent,
    PromptConfirmComponent,
    PromptAlertComponent,
    PromptChooseCardsComponent,
    CardsContainerComponent,
    ChooseCardsPanesComponent,
    PromptChooseEnergyComponent,
    PromptChoosePrizeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    PromptComponent
  ]
})
export class PromptModule { }
