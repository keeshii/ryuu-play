import { Component, Input } from '@angular/core';
import { ChooseAttackPrompt, PokemonCard } from '@ptcg/common';
import { TranslateService } from '@ngx-translate/core';

import { AlertService } from '../../../shared/alert/alert.service';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';

@Component({
  selector: 'ptcg-prompt-choose-attack',
  templateUrl: './prompt-choose-attack.component.html',
  styleUrls: ['./prompt-choose-attack.component.scss']
})
export class PromptChooseAttackComponent {

  @Input() prompt: ChooseAttackPrompt;
  @Input() gameState: LocalGameState;

  constructor(
    private alertService: AlertService,
    private cardsBaseService: CardsBaseService,
    private gameService: GameService,
    private translate: TranslateService
  ) { }

  public minimize() {
    this.gameService.setPromptMinimized(this.gameState.localId, true);
  }

  public cancel() {
    const gameId = this.gameState.gameId;
    const id = this.prompt.id;
    this.gameService.resolvePrompt(gameId, id, null);
  }

  public onCardClick(card: PokemonCard): void {
    const isDeleted = this.gameState.deleted;
    const index = this.prompt.cards.indexOf(card);

    if (isDeleted || index === -1) {
      this.cardsBaseService.showCardInfo({ card });
      return;
    }

    const enableAttack = this.prompt.options.enableAttack;
    const enableAbility = this.prompt.options.enableAbility

    const options = {
      enableAttack,
      enableAbility: {
        useWhenInPlay: !!enableAbility.useWhenInPlay,
        useFromHand: !!enableAbility.useFromHand,
        useFromDiscard: !!enableAbility.useFromDiscard
      }
    };

    this.cardsBaseService.showCardInfo({ card, options })
      .then(result => {
        const name = result ? (result.ability || result.attack) : undefined;
        if (!name) {
          return;
        }

        const gameId = this.gameState.gameId;
        const id = this.prompt.id;

        const blocked = this.prompt.options.blocked;
        if (blocked.some(b => b.index === index && b.name === name)) {
          const message = 'GAME_MESSAGES.' + this.prompt.options.blockedMessage;
          this.alertService.toast(this.translate.instant(message));
          return;
        }

        this.gameService.resolvePrompt(gameId, id, { index, name });
      });
  }

}
