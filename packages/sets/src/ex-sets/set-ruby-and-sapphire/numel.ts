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

export class Numel extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Headbutt',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: '',
    },
    {
      name: 'Burn Off',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: '',
      text: 'Flip a coin. If heads, each Defending Pokémon is now Burned.',
    },
  ];

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Numel';

  public fullName: string = 'Numel RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    return state;
  }
}
