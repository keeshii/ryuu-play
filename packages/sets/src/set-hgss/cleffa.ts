import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, SpecialCondition } from '@ptcg/common';
import { PowerType, StoreLike, State, ShuffleDeckPrompt } from '@ptcg/common';
import { AttackEffect, PowerEffect } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { PutDamageEffect, AddSpecialConditionsEffect } from '@ptcg/common';

export class Cleffa extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 30;

  public retreat = [ ];

  public powers = [{
    name: 'Sweet Sleeping Face',
    powerType: PowerType.POKEBODY,
    text: 'As long as Cleffa is Asleep, prevent all damage done to Cleffa ' +
      'by attacks.'
  }];

  public attacks = [
    {
      name: 'Eeeeeeek',
      cost: [ ],
      damage: '',
      text: 'Shuffle your hand into your deck, then draw 6 cards. Cleffa is ' +
        'now Asleep.'
    }
  ];

  public set: string = 'HGSS';

  public name: string = 'Cleffa';

  public fullName: string = 'Cleffa HGSS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Eeeeeeek
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      player.hand.moveTo(player.deck);

      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      specialCondition.target = player.active;
      store.reduceEffect(state, specialCondition);

      return store.prompt(state, [
        new ShuffleDeckPrompt(player.id)
      ], deckOrder => {
        player.deck.applyOrder(deckOrder);
        player.deck.moveTo(player.hand, 6);
      });
    }

    // Sweet Sleeping Face
    if (effect instanceof PutDamageEffect) {
      if (effect.target.cards.includes(this)) {
        const pokemonCard = effect.target.getPokemonCard();
        const isAsleep = effect.target.specialConditions.includes(SpecialCondition.ASLEEP);
        if (pokemonCard === this && isAsleep) {
          // Try to reduce PowerEffect, to check if something is blocking our ability
          try {
            const powerEffect = new PowerEffect(effect.player, this.powers[0], this);
            store.reduceEffect(state, powerEffect);
          } catch {
            return state;
          }
          effect.preventDefault = true;
        }
      }
    }

    return state;
  }

}
