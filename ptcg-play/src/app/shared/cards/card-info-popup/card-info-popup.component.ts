import { Component, Inject, OnInit, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Card, SuperType, PokemonCard, TrainerCard, EnergyCard, Stage } from 'ptcg-server';

export interface CardInfoPopupData {
  card: Card;
  enableAbility?: boolean;
  enableAttack?: boolean;
  enableRetreat?: boolean;
  hideImage?: boolean;
}

@Component({
  selector: 'ptcg-card-info-popup',
  templateUrl: './card-info-popup.component.html',
  styleUrls: ['./card-info-popup.component.scss']
})
export class CardInfoPopupComponent implements OnInit {

  public card: Card;
  public SuperType = SuperType;
  public Stage = Stage;

  public subtitle: string;

  constructor(
    private dialogRef: MatDialogRef<CardInfoPopupComponent>,
    @Inject(MAT_DIALOG_DATA) data: CardInfoPopupData,
  ) {
    const card = {
      ...data.card, stage: Stage.STAGE_1, evolvesFrom: 'Buizel' } as any;
    this.card = card;
    switch (card.superType) {
      case SuperType.POKEMON:
        this.loadPokemonCard(card as PokemonCard);
        break;
      case SuperType.TRAINER:
        this.loadTrainerCard(card as TrainerCard);
        break;
      case SuperType.ENERGY:
        this.loadEnergyCard(card as EnergyCard);
        break;
    }
  }

  loadPokemonCard(card: PokemonCard): void {
    return;
  }

  loadTrainerCard(card: TrainerCard): void {
    return;
  }

  loadEnergyCard(card: EnergyCard): void {
    return;
  }

  ngOnInit() {
  }

}
