import {
  AttachEnergyPrompt,
  AttackEffect,
  CardType,
  ChooseCardsPrompt,
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
      const player = effect.player;

      const hasBasicEnergy = player.discard.cards
        .some(c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC);

      if (!hasBasicEnergy) {
        return state;
      }

      return store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          player.discard,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          {
            superType: SuperType.ENERGY, energyType: EnergyType.BASIC
          },
          { allowCancel: false, min: 0, max: 2, sameTarget: true }
        ),
        transfers => {
          transfers = transfers || [];
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            player.discard.moveCardTo(transfer.card, target.energies);
            target.damage += 10;
          }
        }
      );
    }

    return state;
  }
}
