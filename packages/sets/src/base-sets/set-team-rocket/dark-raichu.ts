import {
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  PutDamageEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

function* useSurpriseThunder(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  let flipResult = false;
  yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
    flipResult = result;
    next();
  });

  if (!flipResult) {
    return state;
  }

  yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
    flipResult = result;
    next();
  });

  const benchDamage = flipResult ? 20 : 10;
  opponent.bench.forEach(benched => {
    if (benched.pokemons.cards.length > 0) {
      const dealDamage = new PutDamageEffect(effect, benchDamage);
      dealDamage.target = benched;
      store.reduceEffect(state, dealDamage);
    }
  });

  return state;
}

export class DarkRaichu extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pikachu';

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Surprise Thunder',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING],
      damage: '30',
      text:
        'Flip a coin. If heads, flip another coin. If the second coin is heads, this attack does 20 damage to each ' +
        'of your opponent\'s Benched Pokémon. If the second coin is tails, this attack does 10 damage to each of ' +
        'your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Raichu';

  public fullName: string = 'Dark Raichu TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useSurpriseThunder(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
