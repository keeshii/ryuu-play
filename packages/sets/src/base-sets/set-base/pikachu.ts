import {
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  DealDamageEffect,
  Effect,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Pikachu extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 40;

  public attacks = [
    {
      name: 'Gnaw',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
    {
      name: 'Thunder Jolt',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: '30',
      text: 'Flip a coin. If tails, Pikachu does 10 damage to itself.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Pikachu';

  public fullName: string = 'Pikachu BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === false) {
          const dealDamage = new DealDamageEffect(effect, 10);
          dealDamage.target = player.active;
          store.reduceEffect(state, dealDamage);
        }
      });
    }

    return state;
  }
}
