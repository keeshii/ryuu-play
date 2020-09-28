import { Action, Player, State, EnergyCard, CardType, PlayCardAction,
  PokemonCardList } from "../../game";
import { SimpleTactic } from "./simple-tactics";

export class AttachEnergyTactic extends SimpleTactic {

  public useTactic(state: State, player: Player): Action | undefined {
    if (player.energyPlayedTurn >= state.turn) {
      return undefined;
    }

    const pokemons = [ player.active, ...player.bench ]
      .filter(p => p.cards.length > 0);

    for (let i = 0; i < pokemons.length; i++) {
      const cardList = pokemons[i];
      const missing = this.getMissingEnergies(cardList);

      for (let j = 0; j < missing.length; j++) {
        const cardType = missing[j];
        const index = player.hand.cards.findIndex(c => {
          if (c instanceof EnergyCard) {
            const isColorless = cardType === CardType.ANY && c.provides.length > 0;
            const isMatch = c.provides.includes(cardType);
            if (isColorless || isMatch) {
              return true;
            }
          }
        });
        try {
          if (index !== -1) {
            return new PlayCardAction(
              player.id,
              index,
              this.getCardTarget(player, state, cardList)
            );
          }
        } catch (error) { }
      }
    }
  }

  private getMissingEnergies(cardList: PokemonCardList): CardType[] {
    const pokemon = cardList.getPokemonCard();
    if (pokemon === undefined || pokemon.attacks.length === 0) {
      return [];
    }

    const cost = pokemon.attacks[pokemon.attacks.length - 1].cost;
    if (cost.length === 0) {
      return [];
    }

    const provided: CardType[] = [];
    cardList.cards.forEach(card => {
      if (card instanceof EnergyCard) {
        card.provides.forEach(energy => provided.push(energy));
      }
    });

    const missing: CardType[] = [];
    let colorless = 0;
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
            missing.push(costType);
          }
      }
    });

    for (let i = 0; i < colorless; i++) {
      missing.push(CardType.ANY);
    }

    return missing;
  }

}
