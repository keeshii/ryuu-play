import { Effect } from "../../game/store/effects/effect";
import { TrainerCard } from "../../game/store/card/trainer-card";
import { CardType, EnergyType, SuperType, TrainerType } from "../../game/store/card/card-types";
import { EnergyCard } from "../../game/store/card/energy-card";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { AttachEnergyEffect, TrainerEffect } from "../../game/store/effects/play-card-effects";
import { GameError } from "../../game/game-error";
import { GameMessage } from "../../game/game-message";
import { AttachEnergyPrompt } from "../../game/store/prompts/attach-energy-prompt";
import { PlayerType, SlotType } from "../../game/store/actions/play-card-action";
import { StateUtils } from "../../game/store/state-utils";

export class Welder extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SSH';

  public name: string = 'Welder';

  public fullName: string = 'Welder UNB';

  public text: string =
    'Attach up to 2 R Energy cards from your hand to 1 of your Pokemon. ' +
    'If you do, draw 3 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.FIRE);
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH, SlotType.ACTIVE ],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { min: 1, max: 2, allowCancel: true }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const energyCard = transfer.card as EnergyCard;
          const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
          store.reduceEffect(state, attachEnergyEffect);
        }
        if (transfers.length > 0) {
          player.deck.moveTo(player.hand, 3);
        }
      });
    }

    return state;
  }

}
