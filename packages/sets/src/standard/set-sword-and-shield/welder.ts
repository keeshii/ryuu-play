import {
  AttachEnergyEffect,
  AttachEnergyPrompt,
  CardType,
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

export class Welder extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SSH';

  public name: string = 'Welder';

  public fullName: string = 'Welder UNB';

  public text: string =
    'Attach up to 2 R Energy cards from your hand to 1 of your Pokémon. If you do, draw 3 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.provides.includes(CardType.FIRE);
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          player.hand,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          {
            superType: SuperType.ENERGY,
            energyType: EnergyType.BASIC,
            name: 'Fire Energy',
          },
          { min: 1, max: 2, allowCancel: true }
        ),
        transfers => {
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
        }
      );
    }

    return state;
  }
}
