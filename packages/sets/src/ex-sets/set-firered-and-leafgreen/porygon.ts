import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Porygon extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Data Retrieval',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'If you have less than 4 cards in your hand, draw cards until you have 4 cards in your hand.'
    },
    {
      name: 'Confuse Ray',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '10',
      text: 'The Defending Pokémon is now Confused.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Porygon';

  public fullName: string = 'Porygon RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const cardsToDraw = Math.max(0, 4 - player.hand.cards.length);
      if (cardsToDraw === 0) {
        return state;
      }
      player.deck.moveTo(player.hand, cardsToDraw);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}
