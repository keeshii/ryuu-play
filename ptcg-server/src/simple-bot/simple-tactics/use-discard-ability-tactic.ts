import { Action, Player, State, UseAbilityAction, PlayerType, PokemonCard,
  SlotType, CardTarget } from '../../game';
import { SimpleTactic } from './simple-tactics';

export class UseDiscardAbilityTactic extends SimpleTactic {

  public useTactic(state: State, player: Player): Action | undefined {
    let bestScore = this.getStateScore(state, player.id);
    let useAbilityAction: UseAbilityAction | undefined;
    const passTurnScore = this.options.scores.tactics.passTurn;

    player.discard.cards.forEach((card, index) => {
      if (!(card instanceof PokemonCard)) {
        return;
      }
      const target: CardTarget = {
        player: PlayerType.BOTTOM_PLAYER,
        slot: SlotType.DISCARD,
        index
      };
      for (const power of card.powers) {
        if (power.useFromDiscard) {
          const action = new UseAbilityAction(player.id, power.name, target);
          const score = this.evaluateAction(state, player.id, action, passTurnScore);

          if (score !== undefined && bestScore < score) {
            bestScore = score;
            useAbilityAction = action;
          }
        }
      }
    });

    return useAbilityAction;
  }

}
