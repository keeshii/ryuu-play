import {
  AttackEffect,
  CardType,
  ChooseCardsPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

import { commonAttacks } from '../../common';

export class Linoone extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Zigzagoon';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Sniff Out',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Put any 1 card from your discard pile into your hand.'
    },
    {
      name: 'Fury Swipes',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20×',
      text: 'Flip 3 coins. This attack does 20 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [];

  public set: string = 'SS';

  public name: string = 'Linoone';

  public fullName: string = 'Linoone SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipDamageTimes = commonAttacks.flipDamageTimes(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      return store.prompt(
        state,
        [
          new ChooseCardsPrompt(
            player.id,
            GameMessage.CHOOSE_CARD_TO_HAND,
            player.discard,
            {},
            { min: 1, max: 1, allowCancel: false }
          ),
        ],
        selected => {
          const cards = selected || [];
          player.discard.moveCardsTo(cards, player.hand);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return flipDamageTimes.use(effect, 3, 20);
    }

    return state;
  }
}
