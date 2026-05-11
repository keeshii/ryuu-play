import {
  AttackEffect,
  Card,
  CardTarget,
  CardType,
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  Effect,
  GameMessage,
  MoveCardsEffect,
  PlayerType,
  PokemonCard,
  PokemonSlot,
  ShuffleDeckPrompt,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
  TrainerType
} from '@ptcg/common';

function* useHoard(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect,
): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  let toolsAttached = 0;

  while (toolsAttached < 2) {
    let cards: Card[] = [];
    yield store.prompt(
      state,
      new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_ATTACH,
        player.deck,
        { superType: SuperType.TRAINER, trainerType: TrainerType.TOOL },
        { min: 0, max: 1, allowCancel: true }
      ),
      selected => {
        cards = selected || [];
        next();
      }
    );

    if (cards.length === 0) {
      break;
    }

    let hasPokemonWithoutTool = false;
    const blocked: CardTarget[] = [];
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, card, target) => {
      if (slot.trainers.cards.some(t => t.trainerType === TrainerType.TOOL)) {
        blocked.push(target);
      } else {
        hasPokemonWithoutTool = true;
      }
    });

    if (!hasPokemonWithoutTool) {
      break;
    }

    let targets: PokemonSlot[] = [];
    yield store.prompt(
      state,
      new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: true, blocked }
      ),
      selected => {
        targets = selected || [];
        next();
      }
    );

    if (targets.length > 0) {
      const moveCardsEffect = new MoveCardsEffect(effect, cards, targets[0].trainers);
      state = store.reduceEffect(state, moveCardsEffect);
      toolsAttached += 1;
    }
  }

  return store.prompt(state, [new ShuffleDeckPrompt(player.id)], deckOrder => {
    player.deck.applyOrder(deckOrder);
  });
}

export class Farfetchd extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Hoard',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for up to 2 Pokémon Tool cards and attach them to any of your Pokémon (excluding Pokémon ' +
        'that already have a Pokémon Tool attached to them). Shuffle your deck afterward.'
    },
    {
      name: 'Cross-Cut',
      cost: [CardType.COLORLESS],
      damage: '10+',
      text: 'If the Defending Pokémon is an Evolved Pokémon, this attack does 10 damage plus 20 more damage.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Farfetch\'d';

  public fullName: string = 'Farfetch\'d RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useHoard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.pokemons.cards.length > 1) {
        effect.damage += 20;
      }
    }

    return state;
  }
}
