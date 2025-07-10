import {
  AttachEnergyPrompt,
  AttackEffect,
  CardType,
  ChooseCardsPrompt,
  Effect,
  EnergyType,
  EvolveEffect,
  GameError,
  GameMessage,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  ShuffleDeckPrompt,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useGatherEnergy(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  yield store.prompt(
    state,
    new AttachEnergyPrompt(
      player.id,
      GameMessage.ATTACH_ENERGY_CARDS,
      player.deck,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      {
        superType: SuperType.ENERGY, energyType: EnergyType.BASIC
      },
      { allowCancel: false, min: 1, max: 1 }
    ),
    transfers => {
      transfers = transfers || [];
      for (const transfer of transfers) {
        const target = StateUtils.getTarget(state, player, transfer.to);
        player.deck.moveCardTo(transfer.card, target.energies);
      }
      next();
    }
  );

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Elekid extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 40;

  public powers = [
    {
      name: 'Baby Evolution',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'Once during your turn (before your attack), you may put Electabuzz from your hand onto Elekid (this counts ' +
        'as evolving Elekid) and remove all damage counters from Elekid.'
    },
  ];

  public attacks = [
    {
      name: 'Gather Energy',
      cost: [CardType.LIGHTNING],
      damage: '',
      text: 'Search your deck for a basic Energy card and attach it to 1 of your Pokémon. Shuffle your deck afterward.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Elekid';

  public fullName: string = 'Elekid SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (!pokemonSlot) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const hasElectabuzz = player.hand.cards.some(c => c.name === 'Electabuzz');
      if (!hasElectabuzz) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_EVOLVE,
          player.hand,
          { superType: SuperType.POKEMON, name: 'Electabuzz' },
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
      const generator = useGatherEnergy(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
