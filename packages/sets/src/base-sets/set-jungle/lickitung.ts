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

export class Lickitung extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 90;

  public attacks = [
    {
      name: 'Tongue Wrap',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Supersonic',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Lickitung';

  public fullName: string = 'Lickitung JU';

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

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    return state;
  }
}
