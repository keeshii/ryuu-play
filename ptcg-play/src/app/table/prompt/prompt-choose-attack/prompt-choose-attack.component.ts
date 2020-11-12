import { Component, OnInit, Input } from '@angular/core';
import { ChooseAttackPrompt, PokemonCard } from 'ptcg-server';

import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';

@Component({
  selector: 'ptcg-prompt-choose-attack',
  templateUrl: './prompt-choose-attack.component.html',
  styleUrls: ['./prompt-choose-attack.component.scss']
})
export class PromptChooseAttackComponent implements OnInit {

  @Input() prompt: ChooseAttackPrompt;
  @Input() gameState: LocalGameState;

  constructor(
    private cardsBaseService: CardsBaseService,
    private gameService: GameService
  ) { }

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

    const options = { enableAttack: true };
    this.cardsBaseService.showCardInfo({ card, options })
      .then(result => {
        if (!result || !result.attack) {
          return;
        }
        const gameId = this.gameState.gameId;
        const id = this.prompt.id;
        const attack = result.attack;
        this.gameService.resolvePrompt(gameId, id, { index, attack });
      });
  }

  ngOnInit() {
  }


}
