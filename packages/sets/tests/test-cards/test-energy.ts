import { CardType, EnergyCard, StateUtils } from "@ptcg/common";

// An energy card used to pay for attacks in tests.
export class TestEnergy extends EnergyCard {

  public provides: CardType[] = [];

  public set: string = 'TEST';

  public name: string = 'Test Energy';

  public fullName: string = 'Test Energy TEST';

  constructor(cardType?: CardType) {
    super();
    this.provides = cardType ? [ cardType ] : StateUtils.rainbowEnergy();
  }
}
