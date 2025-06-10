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

export class Treecko extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Poison Breath',
      cost: [CardType.GRASS],
      damage: '',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.',
    },
  ];

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.WATER, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Treecko';

  public fullName: string = 'Treecko RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    return state;
  }
}
