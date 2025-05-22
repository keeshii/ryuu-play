import {
  AttachEnergyPrompt,
  CardTarget,
  CardType,
  CheckPokemonTypeEffect,
  Effect,
  EnergyCard,
  EnergyType,
  GameError,
  GameMessage,
  PlayerType,
  SlotType,
  State,
  StateUtils,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class DarkPatch extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW2';

  public name: string = 'Dark Patch';

  public fullName: string = 'Dark Patch DEX';

  public text: string = 'Attach a basic D Energy card from your discard pile to 1 of your Benched D Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.provides.includes(CardType.DARK);
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      let hasDarkPokemonOnBench = false;
      const blockedTo: CardTarget[] = [];
      player.bench.forEach((bench, index) => {
        if (bench.cards.length === 0) {
          return;
        }
        const checkPokemonTypeEffect = new CheckPokemonTypeEffect(bench);
        store.reduceEffect(state, checkPokemonTypeEffect);

        if (checkPokemonTypeEffect.cardTypes.includes(CardType.DARK)) {
          hasDarkPokemonOnBench = true;
        } else {
          const target: CardTarget = {
            player: PlayerType.BOTTOM_PLAYER,
            slot: SlotType.BENCH,
            index,
          };
          blockedTo.push(target);
        }
      });

      if (!hasDarkPokemonOnBench) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      state = store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          player.discard,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          {
            superType: SuperType.ENERGY,
            energyType: EnergyType.BASIC,
            name: 'Darkness Energy',
          },
          { allowCancel: true, min: 1, max: 1, blockedTo }
        ),
        transfers => {
          transfers = transfers || [];

          if (transfers.length === 0) {
            return;
          }

          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            player.discard.moveCardTo(transfer.card, target);
          }

          player.hand.moveCardTo(this, player.discard);
        }
      );
    }

    return state;
  }
}
