import {
  AttackEffect,
  CardType,
  ChoosePokemonPrompt,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  SlotType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

function* useFascinate(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const hasBench = opponent.bench.some(b => b.pokemons.cards.length > 0);

  if (hasBench === false) {
    return state;
  }

  let flipResult = false;
  yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
    flipResult = result;
    next();
  });

  if (!flipResult) {
    return state;
  }

  return store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_SWITCH,
      PlayerType.TOP_PLAYER,
      [SlotType.BENCH],
      { allowCancel: false }
    ),
    targets => {
      if (targets && targets.length > 0) {
        opponent.switchPokemon(targets[0]);
      }
    }
  );
}

export class DarkPersian extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Meowth';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Fascinate',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, choose 1 of your opponent\'s Benched Pokémon and switch it with the Defending ' +
        'Pokémon. This attack can\'t be used if your opponent has no Benched Pokémon.'
    },
    {
      name: 'Poison Claws',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '10',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [];

  public set: string = 'TR';

  public name: string = 'Dark Persian';

  public fullName: string = 'Dark Persian TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipSpecialConditions = commonAttacks.flipSpecialConditions(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useFascinate(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return flipSpecialConditions.use(effect, [SpecialCondition.POISONED]);
    }

    return state;
  }
}
