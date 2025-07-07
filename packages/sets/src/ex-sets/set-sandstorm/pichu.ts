import {
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  Effect,
  EnergyCard,
  EnergyType,
  EvolveEffect,
  GameError,
  GameMessage,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';


function* useEnergyRetrieval(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  const hasBasicEnergy = player.discard.cards
    .some(c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC);

  if (!hasBasicEnergy) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_EVOLVE,
      player.hand,
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      { min: 0, max: 2, allowCancel: false }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  if (cards.length === 0) {
    return state;
  }

  return store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { allowCancel: false }
    ),
    targets => {
      if (!targets || targets.length === 0) {
        return;
      }
      player.discard.moveCardsTo(cards, targets[0].energies);
      targets[0].damage += cards.length * 10;
    }
  );

}

export class Pichu extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 40;

  public powers = [
    {
      name: 'Baby Evolution',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'Once during your turn (before your attack), you may put Pikachu from your hand onto Pichu (this counts as ' +
        'evolving Pichu) and remove all damage counters from Pichu.'
    },
  ];

  public attacks = [
    {
      name: 'Energy Retrieval',
      cost: [CardType.LIGHTNING],
      damage: '',
      text:
        'Search your discard pile for up to 2 basic Energy cards and attach them to 1 of your Pokémon. Put 1 damage ' +
        'counter on that Pokémon for each Energy card attached in this way.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Pichu';

  public fullName: string = 'Pichu SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (!pokemonSlot) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const hasMarril = player.hand.cards.some(c => c.name === 'Pikachu');
      if (!hasMarril) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_EVOLVE,
          player.hand,
          { superType: SuperType.POKEMON, name: 'Pikachu' },
          { min: 1, max: 1, allowCancel: true }
        ),
        selected => {
          const cards = selected || [];

          if (cards.length > 0) {
            const pokemonCard = cards[0] as PokemonCard;
            const evolveEffect = new EvolveEffect(player, pokemonSlot, pokemonCard);
            store.reduceEffect(state, evolveEffect);

            pokemonSlot.damage = 0;
          }
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useEnergyRetrieval(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
