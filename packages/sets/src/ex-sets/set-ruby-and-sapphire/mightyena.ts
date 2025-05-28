import {
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  DealDamageEffect,
  Effect,
  GameMessage,
  GamePhase,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

function* useShakedown(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Opponent has no cards in the hand
  if (opponent.hand.cards.length === 0) {
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

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      opponent.hand,
      {},
      { min: 1, max: 1, allowCancel: false, isSecret: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  opponent.hand.moveCardsTo(cards, opponent.discard);
  return state;
}

// Reduce damage by 10 (before weakness and resistance)
function useIntimidatinMane(
  effect: DealDamageEffect | PutDamageEffect,
  store: StoreLike,
  state: State,
  self: Mightyena
): State {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // It's not an attack
  if (state.phase !== GamePhase.ATTACK) {
    return state;
  }

  // Mightyena is not Active Pokemon
  if (opponent.active.getPokemonCard() !== self) {
    return state;
  }

  // Try to reduce PowerEffect, to check if something is blocking our ability
  try {
    const powerEffect = new PowerEffect(player, self.powers[0], self);
    store.reduceEffect(state, powerEffect);
  } catch {
    return state;
  }

  effect.damage = Math.max(0, effect.damage - 10);
  return state;
}

export class Mightyena extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Poochyena';

  public cardType: CardType = CardType.DARK;

  public hp: number = 70;

  public powers = [
    {
      name: 'Intimidating Fang',
      powerType: PowerType.POKEBODY,
      text:
        'As long as Mightyena is your Active Pokémon, any damage done to your Pokémon by an opponent\'s attack is ' +
        'reduced by 10 (before applying Weakness and Resistance).',
    },
  ];

  public attacks = [
    {
      name: 'Shakedown',
      cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: 'Flip a coin. If heads, choose 1 card from your opponent\'s hand without looking and discard it.',
    },
  ];

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Mightyena';

  public fullName: string = 'Mightyena RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // For Defending Pokemon use DealDamageEffect (before Weakness and Resistance)
    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target === opponent.active) {
        return useIntimidatinMane(effect, store, state, this);
      }
    }

    // For Benched Pokemon use PutDamageEffect
    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.bench.includes(effect.target)) {
        return useIntimidatinMane(effect, store, state, this);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useShakedown(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
