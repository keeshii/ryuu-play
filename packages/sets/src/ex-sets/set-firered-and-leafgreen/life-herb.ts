import {
  CardTag,
  CardTarget,
  ChoosePokemonPrompt,
  CoinFlipPrompt,
  Effect,
  GameError,
  GameMessage,
  HealEffect,
  PlayerType,
  PokemonSlot,
  SlotType,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  const blocked: CardTarget[] = [];
  let hasPokemonWithDamage: boolean = false;
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, card, target) => {
    const hasSpecialCondition = target.slot === SlotType.ACTIVE && slot.specialConditions.length > 0;
    const hasDamage = slot.damage > 0;
    const isPokemonEx = card.tags.includes(CardTag.POKEMON_EX);

    if (!isPokemonEx && (hasSpecialCondition || hasDamage)) {
      hasPokemonWithDamage = true;
    } else {
      blocked.push(target);
    }
  });

  if (hasPokemonWithDamage === false) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let coinResult: boolean = false;
  yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
    coinResult = result;
    next();
  });

  if (coinResult === false) {
    return state;
  }

  let targets: PokemonSlot[] = [];
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

  targets.forEach(target => {
    // Heal damage
    if (target.damage > 0) {
      const healEffect = new HealEffect(player, target, 60);
      store.reduceEffect(state, healEffect);
    }

    // Remove Special Conditions (for active only)
    if (target === player.active && player.active.specialConditions.length > 0) {
      const conditions = player.active.specialConditions.slice();
      conditions.forEach(condition => {
        player.active.removeSpecialCondition(condition);
      });
    }
  });

  return state;
}

export class LifeHerb extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'RG';

  public name: string = 'Life Herb';

  public fullName: string = 'Life Herb RG';

  public text: string =
    'Flip a coin. If heads, choose 1 of your Pokémon (excluding Pokémon-ex), and remove all Special Conditions and ' +
    '6 damage counters from that Pokémon (all if there are less than 6).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
