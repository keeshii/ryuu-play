import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, CardTag } from '@ptcg/common';
import { StoreLike, State, ConfirmPrompt } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';


export class LucarioEx extends PokemonCard {

  public tags = [ CardTag.POKEMON_EX ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 180;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Missile Jab',
      cost: [ CardType.FIGHTING ],
      damage: 30,
      text: 'This attack\'s damage isn\'t affected by Resistance.'
    }, {
      name: 'Corkscrew Smash',
      cost: [ CardType.FIGHTING, CardType.FIGHTING ],
      damage: 60,
      text: 'You may draw cards until you have 6 cards in your hand.'
    }, {
      name: 'Somersault Kick',
      cost: [ CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING ],
      damage: 100,
      text: ''
    }
  ];

  public set: string = 'BW4';

  public name: string = 'Lucario EX';

  public fullName: string = 'Lucario EX FFI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.ignoreResistance = true;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const cardsToDraw = 6 - player.hand.cards.length;
      if (cardsToDraw <= 0) {
        return state;
      }

      return store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_DRAW_CARDS
      ), result => {
        if (result) {
          player.deck.moveTo(player.hand, cardsToDraw);
        }
      });
    }

    return state;
  }

}
