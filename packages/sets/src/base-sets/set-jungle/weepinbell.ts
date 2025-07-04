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

export class Weepinbell extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Bellsprout';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Poisonpowder',
      cost: [CardType.GRASS],
      damage: '10',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
    },
    {
      name: 'Razor Leaf',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '30',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Weepinbell';

  public fullName: string = 'Weepinbell JU';

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
