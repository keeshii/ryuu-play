import {
  ChoosePokemonPrompt,
  DealDamageEffect,
  Effect,
  EndTurnEffect,
  GameMessage,
  PlayerType,
  PokemonCardList,
  SlotType,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';


export class Defender extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public name: string = 'Defender';

  public fullName: string = 'Defender BS';

  public text: string =
    'Attach Defender to 1 of your Pokémon. At the end of your opponent\'s next turn, discard Defender. Damage done ' +
    'to that Pokémon by attacks is reduced by 20 (after applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      // Do not discard the card yet
      effect.preventDefault = true;

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_HEAL,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: true }
        ),
        results => {
          const targets: PokemonCardList[] = results || [];
          if (targets.length === 0) {
            // Cancelled by user
            return state;
          }
          player.hand.moveCardTo(effect.trainerCard, targets[0]);
        }
      );
    }

    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) {
      effect.damage -= 20;
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        if (cardList.cards.includes(this)) {
          cardList.moveCardTo(this, opponent.discard);
        }
      });
    }

    return state;
  }
}
