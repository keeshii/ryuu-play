import {
  AttackEffect,
  CardTag,
  CardType,
  Effect,
  PokemonCard,
  PutDamageEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class AggronEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Lairon';

  public cardTypes: CardType[] = [CardType.METAL];

  public hp: number = 150;

  public attacks = [
    {
      name: 'Rend',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30+',
      text: 'If the Defending Pokémon has any damage counters on it, this attack does 30 damage plus 30 more damage.'
    },
    {
      name: 'Metal Surge',
      cost: [CardType.METAL, CardType.METAL, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text:
        'Does 20 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for ' +
        'Benched Pokémon.)'
    },
  ];

  public weakness = [
    { type: CardType.FIRE },
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.GRASS, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Aggron ex';

  public fullName: string = 'Aggron ex SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.damage) {
        effect.damage += 30;
      }
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
    }

    return state;
  }
}
