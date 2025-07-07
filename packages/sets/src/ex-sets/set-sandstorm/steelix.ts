import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  PutDamageEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Steelix extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Onix';

  public cardTypes: CardType[] = [CardType.METAL];

  public hp: number = 100;

  public attacks = [
    {
      name: 'Rage',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '10+',
      text: 'Does 10 damage plus 10 more damage for each damage counter on Steelix.'
    },
    {
      name: 'Spinning Tail',
      cost: [CardType.METAL, CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Does 20 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched ' +
        'Pokémon.)'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public resistance = [
    { type: CardType.GRASS, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Steelix';

  public fullName: string = 'Steelix SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage += effect.player.active.damage;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.bench.forEach(benched => {
        if (benched.pokemons.cards.length > 0) {
          const dealDamage = new PutDamageEffect(effect, 20);
          dealDamage.target = benched;
          store.reduceEffect(state, dealDamage);
        }
      });

      effect.damage = 20;
      return state;
    }

    return state;
  }
}
