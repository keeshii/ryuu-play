import {
  AttackEffect,
  CardType,
  Effect,
  PlayerType,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Durant extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.METAL];

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Devour',
      cost: [CardType.METAL],
      damage: '',
      text: 'For each of your Durant in play, discard the top card of your opponent\'s deck.',
    },
    {
      name: 'Vice Grip',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: '',
    },
  ];

  public set: string = 'BW';

  public name: string = 'Durant';

  public fullName: string = 'Durant NV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let durantsInPlay = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card.name === this.name) {
          durantsInPlay++;
        }
      });

      opponent.deck.moveTo(opponent.discard, durantsInPlay);
    }

    return state;
  }
}
