import {
  Effect,
  EndTurnEffect,
  PlayerType,
  PutDamageEffect,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class Pluspower extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public name: string = 'PlusPower';

  public fullName: string = 'PlusPower BS';

  public text: string =
    'Attach PlusPower to your Active Pokémon. At the end of your turn, discard PlusPower. If this Pokémon\'s attack ' +
    'does damage to the Defending Pokémon (after applying Weakness and Resistance), the attack does 10 more damage ' +
    'to the Defending Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      // There is an errata for PlusPower, that it is not attached anymore,
      // but this is card implementation of the old behaviour

      // Do not discard the card, it will be attached
      effect.preventDefault = true;
      player.hand.moveCardTo(effect.trainerCard, player.active);

    }

    if (effect instanceof PutDamageEffect && effect.source.cards.includes(this)) {
      effect.damage += 10; // After weakness and resistance
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.cards.includes(this)) {
          cardList.moveCardTo(this, player.discard);
        }
      });
    }

    return state;
  }
}
