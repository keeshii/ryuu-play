import { AttackEffect, PowerEffect } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, CardTag } from '@ptcg/common';
import { PlayPokemonEffect } from '@ptcg/common';
import { PowerType, StoreLike, State, ConfirmPrompt, GameMessage } from '@ptcg/common';


export class ShayminEx extends PokemonCard {

  public tags = [ CardTag.POKEMON_EX ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 110;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Set Up',
    powerType: PowerType.ABILITY,
    text: 'When you put this Pokemon from your hand onto your Bench, ' +
      'you may draw cards until you have 6 cards in your hand.'
  }];

  public attacks = [
    {
      name: 'Sky Return',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 30,
      text: 'Return this Pokemon and all cards attached to it to your hand.'
    }
  ];

  public set: string = 'BW3';

  public name: string = 'Shaymin EX';

  public fullName: string = 'Shaymin EX ROS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const cards = player.hand.cards.filter(c => c !== this);
      const cardsToDraw = Math.max(0, 6 - cards.length);
      if (cardsToDraw === 0) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      return store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          player.deck.moveTo(player.hand, cardsToDraw);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const target = player.active;
      target.moveTo(player.hand);
      target.clearEffects();
      return state;
    }

    return state;
  }

}
