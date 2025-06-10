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

export class Electrike3 extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Super Thunder Wave',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Flip a coin. If heads, each Defending Pokémon is now Paralyzed.',
    },
    {
      name: 'Tackle',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: '',
    },
  ];

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.METAL, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Electrike';

  public fullName: string = 'Electrike RS-3';

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

    return state;
  }
}
