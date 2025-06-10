import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  PutDamageEffect,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Dugtrio extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Diglett';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Slash',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: '40',
      text: ''
    },
    {
      name: 'Earthquake',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING],
      damage: '70',
      text:
        'Does 10 damage to each of your own Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched ' +
        'Pokémon.)'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public resistance = [
    { type: CardType.LIGHTNING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Dugtrio';

  public fullName: string = 'Dugtrio BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      player.bench.forEach(benched => {
        if (benched.pokemons.cards.length > 0) {
          const dealDamage = new PutDamageEffect(effect, 10);
          dealDamage.target = benched;
          store.reduceEffect(state, dealDamage);
        }
      });
    }

    return state;
  }
}
