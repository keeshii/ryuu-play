import { Component, Input } from '@angular/core';
import { CardType } from 'ptcg-server';

@Component({
  selector: 'ptcg-energy',
  templateUrl: './energy.component.html',
  styleUrls: ['./energy.component.scss']
})
export class EnergyComponent {

  public typeClass = 'energyless';

  @Input() set type(value: CardType) {
    switch (value) {
      case CardType.COLORLESS:
        this.typeClass = 'colorless';
        break;
      case CardType.GRASS:
        this.typeClass = 'grass';
        break;
      case CardType.FIGHTING:
        this.typeClass = 'fighting';
        break;
      case CardType.PSYCHIC:
        this.typeClass = 'psychic';
        break;
      case CardType.WATER:
        this.typeClass = 'water';
        break;
      case CardType.LIGHTNING:
        this.typeClass = 'lightning';
        break;
      case CardType.METAL:
        this.typeClass = 'metal';
        break;
      case CardType.DARK:
        this.typeClass = 'darkness';
        break;
      case CardType.FIRE:
        this.typeClass = 'fire';
        break;
      case CardType.DRAGON:
        this.typeClass = 'dragon';
        break;
      case CardType.FAIRY:
        this.typeClass = 'fairy';
        break;
      default:
        this.typeClass = 'energyless';
    }
  }

  constructor() { }

}
