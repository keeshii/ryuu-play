import { AttackEffect, PowerEffect } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, CardTag, SuperType, TrainerType, SpecialCondition } from '@ptcg/common';
import { PlayPokemonEffect } from '@ptcg/common';
import { PowerType, StoreLike, State, GameMessage, ChooseCardsPrompt,
  ShuffleDeckPrompt } from '@ptcg/common';
import {AddSpecialConditionsEffect } from '@ptcg/common';


function* useStellarGuidance(next: Function, store: StoreLike, state: State,
  self: JirachiEx, effect: PlayPokemonEffect): IterableIterator<State> {
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
    { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
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

export class JirachiEx extends PokemonCard {

  public tags = [ CardTag.POKEMON_EX ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Stellar Guidance',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokemon from your hand onto your Bench, ' +
      'you may search your deck for a Supporter card, reveal it, and put it ' +
      'into your hand. Shuffle your deck afterward.'
  }];

  public attacks = [
    {
      name: 'Hypnostrike',
      cost: [ CardType.METAL, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 60,
      text: 'Both this Pokemon and the Defending Pokemon are now Asleep.'
    }
  ];

  public set: string = 'BW3';

  public name: string = 'Jirachi EX';

  public fullName: string = 'Jirachi EX PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const generator = useStellarGuidance(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const asleepEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      asleepEffect.target = player.active;
      store.reduceEffect(state, asleepEffect);

      const asleepEffect2 = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, asleepEffect2);
    }

    return state;
  }

}
