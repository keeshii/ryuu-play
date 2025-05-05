import { State, PokemonCardList, CardType, EnergyCard, PlayerType } from '../../game';
import { SimpleScore } from './score';

export class EnergyScore extends SimpleScore {

  public getScore(state: State, playerId: number): number {
    const player = this.getPlayer(state, playerId);
    const scores = this.options.scores.energy;
    let score = 0;

    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemon, target) => {
      let missing: CardType[] = this.getMissingEnergies(cardList, pokemon.retreat);
      pokemon.attacks.forEach(a => {
        const missing2 = this.getMissingEnergies(cardList, a.cost);
        missing = this.mergeMissing(missing, missing2);
      });

      const multipier = cardList === player.active
        ? scores.active
        : scores.bench;

      missing.forEach(p => {
        score += p === CardType.ANY
          ? scores.missingColorless * multipier
          : scores.missingMatch * multipier;
      });
    });

    return score;
  }

  private mergeMissing(missing1: CardType[], missing2: CardType[]): CardType[] {
    let any1 = 0;
    missing1.forEach(c => { any1 += c === CardType.ANY ? 1 : 0; });
    missing1 = missing1.filter(c => c !== CardType.ANY);
    let any2 = 0;
    missing2.forEach(c => { any2 += c === CardType.ANY ? 1 : 0; });
    missing2 = missing2.filter(c => c !== CardType.ANY);

    missing1.forEach(c => {
      const index = missing2.indexOf(c);
      if (index !== -1) {
        missing2.splice(index, 1);
      } else if (any2 > 0) {
        any2 -= 1;
      }
    });

    missing2.forEach(c => {
      missing1.push(c);
    });

    const max = Math.max(any1, any2);
    for (let i = 0; i < max ; i++) {
      missing1.push(CardType.ANY);
    }

    return missing1;
  }


  private getMissingEnergies(cardList: PokemonCardList, cost: CardType[]): CardType[] {
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
        default: {
          const index = provided.findIndex(energy => energy === costType);
          if (index !== -1) {
            provided.splice(index, 1);
          } else {
            missing.push(costType);
          }
        }
      }
    });

    colorless -= provided.length;

    for (let i = 0; i < colorless; i++) {
      missing.push(CardType.ANY);
    }

    return missing;
  }

}
