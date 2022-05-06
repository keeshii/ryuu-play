import { Action, Player, State, EnergyCard, PlayCardAction, CardTarget,
  PlayerType, Card} from '../../game';
import { SimpleTactic } from './simple-tactics';
import { EnergyScore } from '../state-score/energy-score';

export class AttachEnergyTactic extends SimpleTactic {

  public useTactic(state: State, player: Player): Action | undefined {
    if (player.energyPlayedTurn >= state.turn) {
      return undefined;
    }

    // Distinct list with player's energies.
    const energies: EnergyCard[] = [];
    player.hand.cards.forEach(c => {
      if (c instanceof EnergyCard && !energies.some(e => e.fullName === c.fullName)) {
        energies.push(c);
      }
    });

    if (energies.length === 0) {
      return;
    }

    const energyScore = new EnergyScore(this.options);
    const baseScore = energyScore.getScore(state, player.id);
    const targets: { target: CardTarget, card: Card, score: number }[] = [];
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemon, target) => {

      for (const card of energies) {
        cardList.cards.push(card);
        const score = energyScore.getScore(state, player.id);
        cardList.cards.pop();
        if (score > baseScore) {
          targets.push({ target, score, card });
        }
      }
    });

    if (targets.length === 0) {
      return;
    }

    targets.sort((a, b) => b.score - a.score);
    const target = targets[0].target;
    const index = player.hand.cards.indexOf(targets[0].card);
    return new PlayCardAction(player.id, index, target); 
  }

}
