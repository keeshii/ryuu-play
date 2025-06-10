import {
  CardTarget,
  CardType,
  CheckRetreatCostEffect,
  ChoosePokemonPrompt,
  Effect,
  GameError,
  GameMessage,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerType,
} from '@ptcg/common';

function* usePower(
  next: Function,
  store: StoreLike,
  state: State,
  self: UnownQ,
  effect: PowerEffect
): IterableIterator<State> {
  const player = effect.player;
  const pokemonSlot = StateUtils.findPokemonSlot(state, self);

  // check if UnownQ is on player's Bench
  if (pokemonSlot === undefined) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }
  const benchIndex = player.bench.indexOf(pokemonSlot);
  if (benchIndex === -1) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }
  const pokemonCard = player.bench[benchIndex].getPokemonCard();
  if (pokemonCard !== self) {
    throw new GameError(GameMessage.ILLEGAL_ACTION);
  }

  // Check if player has a Pokemon without tool, other than UnownQ
  let hasPokemonWithoutTool = false;
  const blocked: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    if (cardList.getTools().length === 0 && card !== self) {
      hasPokemonWithoutTool = true;
    } else {
      blocked.push(target);
    }
  });

  if (!hasPokemonWithoutTool) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  // everything checked, we are ready to attach UnownQ as a tool.
  return store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { allowCancel: true, blocked }
    ),
    targets => {
      if (targets && targets.length > 0) {
        // Attach Unown Q as a Pokemon Tool
        player.bench[benchIndex].moveCardTo(pokemonCard, targets[0].trainers);

        // Discard other cards
        player.bench[benchIndex].moveTo(player.discard);
        player.bench[benchIndex].clearEffects();
      }
    }
  );
}

export class UnownQ extends PokemonCard implements TrainerCard {

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 30;

  public weakness = [{ type: CardType.PSYCHIC, value: 10 }];

  public retreat = [];

  public powers = [
    {
      name: 'Quick',
      useWhenInPlay: true,
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), if Unown Q is on your ' +
        'Bench, you may discard all cards attached to Unown Q and attach Unown Q ' +
        'to 1 of your Pokémon as Pokémon Tool card. As long as Unown Q ' +
        'is attached to a Pokémon, you pay C less to retreat that Pokémon.',
    },
  ];

  public attacks = [
    {
      name: 'Hidden Power',
      cost: [CardType.COLORLESS],
      damage: '20',
      text: '',
    },
  ];

  public text =  '';  // Not displayed anywhere

  public trainerType = TrainerType.TOOL;

  public set: string = 'DP';

  public name: string = 'Unown Q';

  public fullName: string = 'Unown Q MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = usePower(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.trainers.cards.includes(this)) {
      const index = effect.cost.indexOf(CardType.COLORLESS);
      if (index !== -1) {
        effect.cost.splice(index, 1);
      }
      return state;
    }

    return state;
  }
}
