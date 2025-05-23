import {
  CardTag,
  CardTarget,
  ChoosePokemonPrompt,
  Effect,
  GameError,
  GameMessage,
  PlayerType,
  SlotType,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  // Create list of non - Pokemon SP slots
  const blocked: CardTarget[] = [];
  let hasPokemonSp = false;

  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
    const isPokemonSp = card.tags.includes(CardTag.POKEMON_SP);
    hasPokemonSp = hasPokemonSp || isPokemonSp;
    if (!isPokemonSp) {
      blocked.push(target);
    }
  });

  if (!hasPokemonSp) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  return store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { allowCancel: true, blocked }
    ),
    targets => {
      if (targets && targets.length > 0) {
        // Discard trainer only when user selected a Pokemon
        player.hand.moveCardTo(effect.trainerCard, player.discard);

        targets[0].moveTo(player.hand);
        targets[0].damage = 0;
        targets[0].clearEffects();
      }
    }
  );
}

export class PokeTurn extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DP';

  public name: string = 'Poke Turn';

  public fullName: string = 'Poke Turn PL';

  public text: string = 'Return 1 of your Pokémon SP and all cards attached to it to your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
