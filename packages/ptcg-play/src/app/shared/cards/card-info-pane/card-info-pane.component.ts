import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Card, SuperType, Stage, PowerType, EnergyType, TrainerType, PokemonCard } from '@ryuu-play/ptcg-server';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { CardImagePopupComponent } from '../card-image-popup/card-image-popup.component';

export interface CardInfoPaneOptions {
  enableAbility?: {
    useWhenInPlay?: boolean;
    useFromHand?: boolean;
    useFromDiscard?: boolean;
  };
  enableAttack?: boolean;
  enableTrainer?: boolean;
}

export interface CardInfoPaneAction {
  card: Card;
  attack?: string;
  ability?: string;
  trainer?: boolean;
}

@Component({
  selector: 'ptcg-card-info-pane',
  templateUrl: './card-info-pane.component.html',
  styleUrls: ['./card-info-pane.component.scss']
})
export class CardInfoPaneComponent implements OnChanges {

  @Input() card: Card;
  @Input() facedown: boolean;
  @Input() options: CardInfoPaneOptions = {};
  @Output() action = new EventEmitter<any>();

  public enabledAbilities: {[name: string]: boolean} = {};
  public SuperType = SuperType;
  public Stage = Stage;
  public PowerType = PowerType;
  public EnergyType = EnergyType;
  public TrainerType = TrainerType;

  constructor(
    private dialog: MatDialog
  ) { }

  public clickAction(action: CardInfoPaneAction) {
    action.card = this.card;
    this.action.next(action);
  }

  public ngOnChanges() {
    // Build map of enabled powers
    if (this.options.enableAbility) {
      this.enabledAbilities = this.buildEnabledAbilities();
    }
  }

  private buildEnabledAbilities(): {[name: string]: boolean} {
    const enabledAbilities: {[name: string]: boolean} = {};
    if (this.card && this.card.superType === SuperType.POKEMON) {
      const pokemonCard = this.card as PokemonCard;
      pokemonCard.powers.forEach(power => {
        if ((this.options.enableAbility.useWhenInPlay && power.useWhenInPlay)
          || (this.options.enableAbility.useFromDiscard && power.useFromDiscard)
          || (this.options.enableAbility.useFromHand && power.useFromHand)) {
          enabledAbilities[power.name] = true;
        }
      });
    }
    return enabledAbilities;
  }

  public showCardImage(card: Card, facedown: boolean): Promise<void> {
    const dialog = this.dialog.open(CardImagePopupComponent, {
      maxWidth: '100%',
      data: { card, facedown }
    });

    return dialog.afterClosed().toPromise()
      .catch(() => false);
  }

}
