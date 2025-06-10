import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Chimchar extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 40;

  public weakness = [
    {
      type: CardType.WATER,
      value: 10,
    },
  ];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Serial Swipes',
      cost: [CardType.FIRE],
      damage: '10×',
      text: 'Flip 4 coins. This attack does 10 damage times the number of heads.',
    },
    {
      name: 'Sleepy',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40+',
      text:
        'If you have Piplup in play, this attack does 40 damage plus 20 ' +
        'more damage and the Defending Pokémon is now Asleep.',
    },
  ];

  public set: string = 'OP9';

  public name: string = 'Chimchar';

  public fullName: string = 'Chimchar OP9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(
        state,
        [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        ],
        results => {
          let heads: number = 0;
          results.forEach(r => {
            heads += r ? 1 : 0;
          });
          effect.damage = 10 * heads;
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      let isPiplupInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Piplup') {
          isPiplupInPlay = true;
        }
      });

      if (isPiplupInPlay) {
        effect.damage += 20;
        const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
        store.reduceEffect(state, specialCondition);
      }

      return state;
    }

    return state;
  }
}
