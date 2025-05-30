import {
  Card,
  CardTarget,
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  Effect,
  EnergyCard,
  GameError,
  GameMessage,
  HealEffect,
  PlayerType,
  PokemonCardList,
  SlotType,
  State,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  const blocked: CardTarget[] = [];
  let hasPokemonWithDamage: boolean = false;
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    if (cardList.damage === 0 || !cardList.cards.some(c => c instanceof EnergyCard)) {
      blocked.push(target);
    } else {
      hasPokemonWithDamage = true;
    }
  });

  if (hasPokemonWithDamage === false) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Do not discard the card yet
  effect.preventDefault = true;

  let targets: PokemonCardList[] = [];
  yield store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_HEAL,
      PlayerType.BOTTOM_PLAYER,
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
      { superType: SuperType.ENERGY },
      { min: 1, max: 1, allowCancel: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  if (cards.length === 0) {
    return state;
  }

  // Discard trainer only when user selected a Pokemon
  player.hand.moveCardTo(effect.trainerCard, player.discard);
  target.moveCardsTo(cards, player.discard);

  // Heal Pokemon
  const healEffect = new HealEffect(player, target, 40);
  store.reduceEffect(state, healEffect);
  return state;
}

export class SuperPotion extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public name: string = 'Super Potion';

  public fullName: string = 'Super Potion BS';

  public text: string =
    'Discard 1 Energy card attached to your own Pokémon in order to remove up to 4 damage counters from that ' +
    'Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
