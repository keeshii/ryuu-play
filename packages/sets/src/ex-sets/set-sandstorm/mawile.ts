import {
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  ShuffleDeckPrompt,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
  TrainerType,
} from '@ptcg/common';

function* useScam(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (opponent.hand.cards.length === 0) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_DECK,
      opponent.hand,
      { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
      { allowCancel: true, min: 1, max: 1 }
    ),
    results => {
      cards = results || [];
      next();
    }
  );

  if (cards.length === 0) {
    return state;
  }

  opponent.hand.moveCardsTo(cards, opponent.deck);

  return store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
    opponent.deck.applyOrder(order);

    // Draw card after shuffle
    opponent.deck.moveTo(opponent.hand, 1);
  });
}

export class Mawile extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.METAL];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Scam',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Look at your opponent\'s hand. You may have your opponent shuffle a Supporter card you find there into his ' +
        'or her deck. If you do, your opponent draws a card.'
    },
    {
      name: 'Metal Hook',
      cost: [CardType.METAL, CardType.COLORLESS],
      damage: '20',
      text:
        'Before doing damage, you may switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon. ' +
        'If you do, this attack does 20 damage to the new Defending Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Mawile';

  public fullName: string = 'Mawile SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useScam(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.pokemons.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: true }
        ),
        targets => {
          if (targets && targets.length > 0) {
            opponent.switchPokemon(targets[0]);
          }
        }
      );
    }

    return state;
  }
}
