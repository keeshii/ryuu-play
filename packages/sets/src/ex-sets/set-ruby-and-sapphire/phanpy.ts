import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Phanpy extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Stampede',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: '',
    },
    {
      name: 'Trembler',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, this attack does 10 damage to each Defending Pokémon, and each Defending Pokémon is ' +
        'now Paralyzed.',
    },
  ];

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Phanpy';

  public fullName: string = 'Phanpy RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          effect.damage = 10;
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    return state;
  }
}
