import { Card, SuperType } from "@ptcg/common";

// A card with no types or abilities, used in tests.
export class TestCard extends Card {

  public superType: SuperType = SuperType.NONE;

  public set: string = 'TEST';

  public fullName = 'Test TEST';

  public name = 'Test';
}
