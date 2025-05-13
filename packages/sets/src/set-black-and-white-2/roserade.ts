import { Effect } from '@ptcg/common';
import { PokemonCard } from '@ptcg/common';
import { PowerType, StoreLike, State, CoinFlipPrompt, ChooseCardsPrompt, ShuffleDeckPrompt } from '@ptcg/common';
import { Stage, CardType, SpecialCondition } from '@ptcg/common';
import { PlayPokemonEffect } from '@ptcg/common';
import { AttackEffect, PowerEffect } from '@ptcg/common';
import { AddSpecialConditionsEffect } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';

function* useLeParfum(next: Function, store: StoreLike, state: State,
  self: Roserade, effect: PlayPokemonEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  // Try to reduce PowerEffect, to check if something is blocking our ability
  try {
    const powerEffect = new PowerEffect(player, self.powers[0], self);
    store.reduceEffect(state, powerEffect);
  } catch {
    return state;
  }

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { },
    { min: 1, max: 1, allowCancel: true }
  ), selected => {
    const cards = selected || [];
    player.deck.moveCardsTo(cards, player.hand);
    next();
  });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}


export class Roserade extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  evolvesFrom = 'Roselia';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.WATER, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Le Parfum',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokemon from your hand to evolve 1 of your ' +
      'Pokemon, you may search your deck for any card and put it into your ' +
      'hand. Shuffle your deck afterward.'
  }];

  public attacks = [
    {
      name: 'Squeeze',
      cost: [ CardType.GRASS, CardType.COLORLESS ],
      damage: '30+',
      text: 'Flip a coin. If heads, this attack does 20 more damage and ' +
        'the Defending Pokemon is now Paralyzed.'
    }
  ];

  public set: string = 'BW2';

  public name: string = 'Roserade';

  public fullName: string = 'Roserade DGE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const generator = useLeParfum(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const addSpecialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          effect.damage += 20;
          store.reduceEffect(state, addSpecialCondition);
        }
      });
    }

    return state;
  }

}
