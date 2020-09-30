import { State, PokemonCardList, CardType, EnergyCard, PlayerType } from '../../game';
import { SimpleScore } from './score';

export class EnergyScore extends SimpleScore {

  public getScore(state: State, playerId: number): number {
    const player = this.getPlayer(state, playerId);
    const scores = this.options.scores.energy;

    let score = 0;

    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
      const energies = this.getRequiredEnergies(player.active);
      const value = cardList === player.active ? scores.active : scores.bench;
      score += value * energies.length;
    })

    return score;
  }

  private getRequiredEnergies(cardList: PokemonCardList): EnergyCard[] {
    const pokemon = cardList.getPokemonCard();
    if (pokemon === undefined) {
      return [];
    }

    let cost: CardType[] = pokemon.retreat;
    pokemon.attacks.forEach(a => { cost = this.mergeCosts(cost, a.cost); })

    const energies = cardList.cards.filter(c => c instanceof EnergyCard) as EnergyCard[];

    const result: EnergyCard[] = [];
    energies.forEach(e => {
      let required = false;
      for (const provided of e.provides) {
        const index = cost.findIndex(c => c === provided || c === CardType.COLORLESS);
        if (index !== -1) {
          cost.splice(index, 1);
          required = true;
        }
      }
      if (required) {
        result.push(e);
      }
    });

    return result;
  }

  private mergeCosts(cost1: CardType[], cost2: CardType[]): CardType[] {
    let c1 = 0;
    cost1.forEach(c => { c1 += c === CardType.COLORLESS ? 1 : 0; });
    cost1 = cost1.filter(c => c !== CardType.COLORLESS);
    let c2 = 0;
    cost2.forEach(c => { c2 += c === CardType.COLORLESS ? 1 : 0; });
    cost2 = cost2.filter(c => c !== CardType.COLORLESS);

    let min = Math.min(c1, c2);
    c1 -= min;
    c2 -= min;

    cost1.forEach(c => {
      const index = cost2.indexOf(c);
      if (index !== -1) {
        cost2.splice(index, 1);
      } else if (c2 > 0) {
        c2 -= 1;
      }
    });

    cost2.forEach(c => {
      cost1.push(c);
    });

    for (let i = 0; i < c1 + c2 ; i++) {
      cost1.push(CardType.COLORLESS);
    }

    return cost1;
  }

}
