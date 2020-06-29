import { Card } from "./card/card";
import { CardType, SuperType } from "./card/card-types";
import { EnergyCard } from "./card/energy-card";

export class StateUtils {
  public static checkEnoughEnergy(cards: Card[], cost: CardType[]): boolean {
    if (cost.length === 0) {
      return true;
    }

    const provided: CardType[] = [];
    cards.forEach(card => {
      if (card.superType === SuperType.ENERGY) {
        (card as EnergyCard).provides.forEach(energy => provided.push(energy));
      }
    });

    let colorless = 0;
    let rainbow = 0;

    // First remove from array cards with specific energy types
    cost.forEach(costType => {
      switch (costType) {
        case CardType.ANY:
        case CardType.NONE:
          break;
        case CardType.COLORLESS:
          colorless += 1;
          break;
        default:
          const index = provided.findIndex(energy => energy === costType);
          if (index !== -1) {
            provided.splice(index, 1);
          } else {
            rainbow += 1;
          }
      }
    });

    // Check if we have enough rainbow energies
    for (let i = 0; i < rainbow; i++) {
      const index = provided.findIndex(energy => energy === CardType.ANY);
      if (index !== -1) {
        provided.splice(index, 1);
      } else {
        return false;
      }
    }

    // Rest cards can be used to pay for colorless energies
    return provided.length >= colorless;
  }

  public static checkExactEnergy(cards: Card[], cost: CardType[]): boolean {
    let enough = StateUtils.checkEnoughEnergy(cards, cost);
    if (!enough) {
      return false;
    }
    for (let i = 0; i < cards.length; i++) {
      const tempCards = cards.slice();
      tempCards.splice(i, 1);
      enough = StateUtils.checkEnoughEnergy(tempCards, cost);
      if (enough) {
        return false;
      }
    }
    return true;
  }

}
