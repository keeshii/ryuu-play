import {
  Card,
  CardTarget,
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  Effect,
  EnergyCard,
  EnergyType,
  FilterType,
  GameError,
  GameMessage,
  PlayerType,
  PokemonCardList,
  Resolver,
  SlotType,
  State,
  StateUtils,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  let hasPokemonWithEnergy = false;
  const blocked: CardTarget[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    if (cardList.cards.some(c => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL)) {
      hasPokemonWithEnergy = true;
    } else {
      blocked.push(target);
    }
  });

  if (!hasPokemonWithEnergy) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  let targets: PokemonCardList[] = [];
  yield store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
      PlayerType.TOP_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { allowCancel: true, blocked }
    ),
    results => {
      targets = results || [];
      next();
    }
  );

  if (targets.length === 0) {
    return state;
  }

  const target = targets[0];
  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      target,
      { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
      { min: 1, max: 1, allowCancel: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  if (cards.length > 0) {
    // Discard trainer only when user selected a Pokemon
    player.hand.moveCardTo(effect.trainerCard, player.discard);
    // Discard selected special energy card
    target.moveCardsTo(cards, opponent.discard);
  }

  return state;
}

export class EnhancedHammer extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW';

  public name: string = 'Enhanced Hammer';

  public fullName: string = 'Enhanced Hammer DEX';

  public text: string = 'Discard a Special Energy attached to 1 of your opponent\'s Pokémon.';

  override *onPlay({ require, player, store, state }: Resolver): Generator<State> {
    require.opponent.hasPokemon({
      with: FilterType.SPECIAL_ENERGY,
    });
    yield* player.choosesPokemon({
      playerType: PlayerType.TOP_PLAYER,
      with: FilterType.SPECIAL_ENERGY,
    }).andDiscards({
      like: FilterType.SPECIAL_ENERGY,
    });
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}
