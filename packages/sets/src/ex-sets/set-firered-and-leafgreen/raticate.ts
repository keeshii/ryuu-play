import {
  AttackEffect,
  Card,
  CardType,
  CheckTableStateEffect,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  Effect,
  EnergyCard,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  ShowCardsPrompt,
  ShuffleDeckPrompt,
  Stage,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
} from '@ptcg/common';

function* usePickup(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  let pokemons = 0;
  let energies = 0;
  let trainers = 0;
  player.discard.cards.forEach((c, index) => {
    if (c instanceof EnergyCard) {
      energies += 1;
    } else if (c instanceof PokemonCard) {
      pokemons += 1;
    } else if (c instanceof TrainerCard) {
      trainers += 1;
    }
  });

  const maxPokemons = Math.min(pokemons, 1);
  const maxEnergies = Math.min(energies, 1);
  const maxTrainers = Math.min(trainers, 1);
  const count = maxPokemons + maxEnergies + maxTrainers;

  if (count === 0) {
    return state;
  }

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.discard,
      {},
      {
        min: count,
        max: count,
        allowCancel: false,
        maxPokemons,
        maxEnergies,
        maxTrainers
      }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  player.discard.moveCardsTo(cards, player.deck);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () =>
      next()
    );
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Raticate extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Rattata';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 70;

  public powers = [
    {
      name: 'Thick Skin',
      powerType: PowerType.POKEBODY,
      text: 'Raticate can\'t be affected by any Special Conditions.'
    },
  ];

  public attacks = [
    {
      name: 'Pickup',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Search your discard pile for a Basic Pokémon (or Evolution card), a Trainer card, and an Energy card. Show ' +
        'them to your opponent and put them into your hand.'
    },
    {
      name: 'Quick Attack',
      cost: [CardType.COLORLESS],
      damage: '10+',
      text: 'Flip a coin. If heads, this attack does 10 damage plus 40 more damage.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [];

  public set: string = 'RG';

  public name: string = 'Raticate';

  public fullName: string = 'Raticate RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        const conditions = player.active.specialConditions.slice();

        if (player.active.getPokemonCard() !== this || conditions.length === 0) {
          return;
        }

        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }

        conditions.forEach(condition => {
          player.active.removeSpecialCondition(condition);
        });
      });
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = usePickup(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
        if (result === true) {
          effect.damage += 40;
        }
      });
    }

    return state;
  }
}
