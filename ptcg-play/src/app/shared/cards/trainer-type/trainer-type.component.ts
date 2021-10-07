import { Component, Input } from '@angular/core';
import {TrainerType} from 'ptcg-server';

@Component({
  selector: 'ptcg-trainer-type',
  templateUrl: './trainer-type.component.html',
  styleUrls: ['./trainer-type.component.scss']
})
export class TrainerTypeComponent {

  public typeClass = 'energy';

  @Input() set type(trainerType: TrainerType) {
    switch (trainerType) {
      case TrainerType.ITEM:
      case TrainerType.TOOL:
        this.typeClass = 'item';
        break;
      case TrainerType.SUPPORTER:
        this.typeClass = 'supporter';
        break;
      case TrainerType.STADIUM:
        this.typeClass = 'stadium';
        break;
      default:
        this.typeClass = 'energy';
    }
  }

  constructor() { }

}
