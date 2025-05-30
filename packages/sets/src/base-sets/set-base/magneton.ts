import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  DealDamageEffect,
  Effect,
  GameMessage,
  PokemonCard,
  PutDamageEffect,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Magneton extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Magnemite';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 60;

  public attacks = [
    {
      name: 'Thunder Wave',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: '30',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Selfdestruct',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '80',
      text:
        'Does 20 damage to each Pokémon on each player\'s Bench. (Don\'t apply Weakness and Resistance for Benched ' +
        'Pokémon.) Magneton does 80 damage to itself. '
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Magneton';

  public fullName: string = 'Magneton BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.bench.forEach(benched => {
        if (benched.cards.length > 0) {
          const dealDamage = new PutDamageEffect(effect, 20);
          dealDamage.target = benched;
          store.reduceEffect(state, dealDamage);
        }
      });

      opponent.bench.forEach(benched => {
        if (benched.cards.length > 0) {
          const dealDamage = new PutDamageEffect(effect, 20);
          dealDamage.target = benched;
          store.reduceEffect(state, dealDamage);
        }
      });

      const dealDamage = new DealDamageEffect(effect, 80);
      dealDamage.target = player.active;
      store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}
