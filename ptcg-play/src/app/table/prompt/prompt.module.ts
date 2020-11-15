import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardModule } from '../board/board.module';
import { PromptComponent } from './prompt.component';
import { PromptConfirmComponent } from './prompt-confirm/prompt-confirm.component';
import { PromptAlertComponent } from './prompt-alert/prompt-alert.component';
import { SharedModule } from '../../shared/shared.module';
import { PromptChooseCardsComponent } from './prompt-choose-cards/prompt-choose-cards.component';
import { CardsContainerComponent } from './cards-container/cards-container.component';
import { ChooseCardsPanesComponent } from './choose-cards-panes/choose-cards-panes.component';
import { PromptAttachEnergyComponent } from './prompt-attach-energy/prompt-attach-energy.component';
import { PromptChooseEnergyComponent } from './prompt-choose-energy/prompt-choose-energy.component';
import { PromptChoosePrizeComponent } from './prompt-choose-prize/prompt-choose-prize.component';
import { PromptChoosePokemonComponent } from './prompt-choose-pokemon/prompt-choose-pokemon.component';
import { PromptGameOverComponent } from './prompt-game-over/prompt-game-over.component';
import { PromptShowCardsComponent } from './prompt-show-cards/prompt-show-cards.component';
import { ChoosePokemonsPaneComponent } from './choose-pokemons-pane/choose-pokemons-pane.component';
import { PromptOrderCardsComponent } from './prompt-order-cards/prompt-order-cards.component';
import { PromptMoveDamageComponent } from './prompt-move-damage/prompt-move-damage.component';
import { PromptMoveEnergyComponent } from './prompt-move-energy/prompt-move-energy.component';
import { PromptSelectComponent } from './prompt-select/prompt-select.component';
import { PromptInvitePlayerComponent } from './prompt-invite-player/prompt-invite-player.component';
import { PromptChooseAttackComponent } from './prompt-choose-attack/prompt-choose-attack.component';
import { PromptPutDamageComponent } from './prompt-put-damage/prompt-put-damage.component';


@NgModule({
  declarations: [
    PromptComponent,
    PromptConfirmComponent,
    PromptAlertComponent,
    PromptAttachEnergyComponent,
    PromptChooseCardsComponent,
    CardsContainerComponent,
    ChooseCardsPanesComponent,
    PromptChooseEnergyComponent,
    PromptChoosePrizeComponent,
    PromptChoosePokemonComponent,
    PromptGameOverComponent,
    PromptShowCardsComponent,
    ChoosePokemonsPaneComponent,
    PromptOrderCardsComponent,
    PromptMoveDamageComponent,
    PromptMoveEnergyComponent,
    PromptSelectComponent,
    PromptInvitePlayerComponent,
    PromptChooseAttackComponent,
    PromptPutDamageComponent
  ],
  imports: [
    BoardModule,
    CommonModule,
    SharedModule,
  ],
  exports: [
    PromptComponent
  ]
})
export class PromptModule { }
