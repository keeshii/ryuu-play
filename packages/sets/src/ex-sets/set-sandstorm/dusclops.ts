import {
  AttackEffect,
  CardType,
  CheckHpEffect,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  PutCountersEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Dusclops extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Duskull';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Judgement',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '',
      text: 'Flip 2 coins. If both of them are heads, the Defending Pokémon is Knocked Out.'
    },
    {
      name: 'Random Curse',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text: 'Put a total of 5 damage counters on all Defending Pokémon in any way you like.'
    },
  ];

  public weakness = [
    { type: CardType.DARK }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Dusclops';

  public fullName: string = 'Dusclops SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(
        state,
        [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)],
        results => {
          if (results.includes(false)) {
            return;
          }
          const checkHpEffect = new CheckHpEffect(player, opponent.active);
          store.reduceEffect(state, checkHpEffect);
          const hpLeft = Math.max(0, checkHpEffect.hp - opponent.active.damage);

          // Put Counters equal to HP left (Knock Out)
          const putCountersEffect = new PutCountersEffect(effect, hpLeft);
          store.reduceEffect(state, putCountersEffect);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const putCountersEffect = new PutCountersEffect(effect, 50);
      store.reduceEffect(state, putCountersEffect);
    }

    return state;
  }
}
