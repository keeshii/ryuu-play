import {
  AttachEnergyPrompt,
  CardList,
  CardTarget,
  Effect,
  EnergyCard,
  EnergyType,
  GameMessage,
  GamePhase,
  KnockOutEffect,
  PlayerType,
  SlotType,
  State,
  StateUtils,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerType,
} from '@ptcg/common';

export class ExpShare extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BW';

  public name: string = 'Exp Share';

  public fullName: string = 'Exp Share SUM';

  public text: string =
    'When your Active Pokémon is Knocked Out by damage from an opponent\'s ' +
    'attack, you may move 1 basic Energy card that was attached to that ' +
    'Pokémon to the Pokémon this card is attached to.';

  public readonly EXP_SHARE_MARKER: string = 'EXP_SHARE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof KnockOutEffect && effect.target === effect.player.active) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const active = effect.target;

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      if (active.marker.hasMarker(this.EXP_SHARE_MARKER)) {
        return state;
      }

      let expShareCount = 0;
      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, card, target) => {
        if (pokemonSlot === effect.target) {
          return;
        }
        if (pokemonSlot.trainers.cards.some(t => t instanceof ExpShare)) {
          expShareCount++;
        } else {
          blockedTo.push(target);
        }
      });

      if (expShareCount === 0) {
        return state;
      }

      // Add marker, do not invoke this effect for other exp. share
      active.marker.addMarker(this.EXP_SHARE_MARKER, this);

      // Make copy of the active pokemon cards,
      // because they will be transfered to discard shortly
      const activeCopy = new CardList<EnergyCard>();
      activeCopy.cards = player.active.energies.cards.slice();

      state = store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          activeCopy,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          {
            allowCancel: true,
            min: 1,
            max: expShareCount,
            differentTargets: true,
            blockedTo,
          }
        ),
        transfers => {
          transfers = transfers || [];
          active.marker.removeMarker(this.EXP_SHARE_MARKER);
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            player.discard.moveCardTo(transfer.card, target.energies);
          }
        }
      );
    }

    return state;
  }
}
