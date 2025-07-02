import {
  AttackEffect,
  CardType,
  ChoosePokemonPrompt,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

function* useRapidSpin(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const hasPlayerBench = player.bench.some(b => b.pokemons.cards.length > 0);
  const hasOpponentBench = opponent.bench.some(b => b.pokemons.cards.length > 0);

  if (hasOpponentBench) {
    yield store.prompt(
      state,
      new ChoosePokemonPrompt(
        opponent.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ),
      targets => {
        if (targets && targets.length > 0) {
          opponent.switchPokemon(targets[0]);
        }
        next();
      }
    );
  }
  
  if (hasPlayerBench) {
    yield store.prompt(
      state,
      new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ),
      targets => {
        if (targets && targets.length > 0) {
          player.switchPokemon(targets[0]);
        }
        next();
      }
    );
  }
  
  return state;
}

export class Baltoy extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Rapid Spin',
      cost: [CardType.COLORLESS],
      damage: '10',
      text:
        'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon, if any. You switch ' +
        'Baltoy with 1 of your Benched Pokémon, if any.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Baltoy';

  public fullName: string = 'Baltoy SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useRapidSpin(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
