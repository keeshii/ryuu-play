import {
  CardType,
  ChoosePokemonPrompt,
  Effect,
  GameMessage,
  PlayerType,
  PlayPokemonEffect,
  PokemonCard,
  PokemonSlot,
  PowerEffect,
  PowerType,
  SlotType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

function* useReturn(
  next: Function,
  store: StoreLike,
  state: State,
  self: Unown,
  effect: PlayPokemonEffect
): IterableIterator<State> {
  const player = effect.player;

  // Try to reduce PowerEffect, to check if something is blocking our ability
  try {
    const powerEffect = new PowerEffect(player, self.powers[0], self);
    store.reduceEffect(state, powerEffect);
  } catch {
    return state;
  }

  let targets: PokemonSlot[] = [];
  yield store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { allowCancel: true }
    ),
    selection => {
      targets = selection || [];
      next();
    }
  );

  if (targets.length === 0) {
    return state;
  }

  targets[0].energies.moveTo(player.hand);
  return state;
}

export class Unown extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 50;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public powers = [
    {
      name: 'Return',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn, when you put Unown from your hand onto ' +
        'your Bench, you may return all Energy attached to 1 of your Pokémon ' +
        'to your hand.',
    },
  ];

  public attacks = [
    {
      name: 'Hidden Power',
      cost: [CardType.PSYCHIC],
      damage: '10',
      text: '',
    },
  ];

  public set: string = 'HGSS';

  public name: string = 'Unown';

  public fullName: string = 'Unown HGSS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const generator = useReturn(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
