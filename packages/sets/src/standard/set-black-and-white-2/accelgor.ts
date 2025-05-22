import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  ShuffleDeckPrompt,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Accelgor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Shelmet';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [];

  public attacks = [
    {
      name: 'Hammer In',
      cost: [CardType.GRASS],
      damage: '20',
      text: '',
    },
    {
      name: 'Deck and Cover',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text:
        'The Defending Pokémon is now Paralyzed and Poisoned. Shuffle this ' +
        'Pokémon and all cards attached to it into your deck.',
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Accelgor';

  public fullName: string = 'Accelgor DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [
        SpecialCondition.PARALYZED,
        SpecialCondition.POISONED,
      ]);
      store.reduceEffect(state, specialConditionEffect);

      player.active.moveTo(player.deck);
      player.active.clearEffects();

      return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });
    }

    return state;
  }
}
