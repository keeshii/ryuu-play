import {
  AttackEffect,
  CardTag,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Hariyama extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Makuhita';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 90;

  public attacks = [
    {
      name: 'Super Slap Push',
      cost: [CardType.FIGHTING],
      damage: '',
      text: 'Does 20 damage to each Defending Pokémon.',
    },
    {
      name: 'Mega Throw',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40+',
      text: 'If the Defending Pokémon is a Pokémon-ex, this attack does 40 damage plus 40 more damage.',
    },
  ];

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Hariyama';

  public fullName: string = 'Hariyama RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage = 20;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const defending = opponent.active.getPokemonCard();
      if (defending && defending.tags.includes(CardTag.POKEMON_EX)) {
        effect.damage += 40;
      }
    }

    return state;
  }
}
