import { CardType, EnergyCard } from "@ptcg/common";

// An energy card used to pay for attacks in tests.
export class TestEnergy extends EnergyCard {

  public provides: CardType[] = [];

  public set: string = 'TEST';

  public name: string = 'Test Energy';

  public fullName: string = 'Test Energy TEST';

  constructor(cardType: CardType = CardType.ANY) {
    super();
    this.provides = [ cardType ];
  }
}
