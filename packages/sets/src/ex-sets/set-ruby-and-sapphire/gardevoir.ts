import {
  AttachEnergyPrompt,
  AttackEffect,
  CardAssign,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  EndTurnEffect,
  EnergyType,
  GameError,
  GameMessage,
  PlayerType,
  PlayPokemonEffect,
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

function* usePsyShadow(
  next: Function,
  store: StoreLike,
  state: State,
  self: Gardevoir,
  effect: PowerEffect
): IterableIterator<State> {
  const player = effect.player;
  const pokemonSlot = StateUtils.findPokemonSlot(state, self);

  if (!pokemonSlot || pokemonSlot.specialConditions.length > 0) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }
  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }
  if (player.marker.hasMarker(self.PSY_SHADOW_MARKER, self)) {
    throw new GameError(GameMessage.POWER_ALREADY_USED);
  }

  let transfers: CardAssign[] = [];
  yield store.prompt(
    state,
    new AttachEnergyPrompt(
      player.id,
      GameMessage.ATTACH_ENERGY_CARDS,
      player.deck,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      {
        superType: SuperType.ENERGY,
        energyType: EnergyType.BASIC,
        name: 'Psychic Energy',
      },
      { allowCancel: true, min: 1, max: 1 }
    ),
    result => {
      transfers = result || [];
      next();
    }
  );

  player.marker.addMarker(self.PSY_SHADOW_MARKER, self);

  for (const transfer of transfers) {
    const target = StateUtils.getTarget(state, player, transfer.to);
    player.discard.moveCardTo(transfer.card, target.energies);
    target.damage += 20;
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Gardevoir extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Kirlia';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 100;

  public powers = [
    {
      name: 'Psy Shadow',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'Once during your turn (before your attack), you may search your deck for a P Energy card and attach ' +
        'it to 1 of your Pokémon. Put 2 damage counters on that Pokémon. Shuffle your deck afterward. This power ' +
        'can\'t be used if Gardevoir is affected by a Special Condition.',
    },
  ];

  public attacks = [
    {
      name: 'Energy Burst',
      cost: [CardType.PSYCHIC],
      damage: '10×',
      text: 'Does 10 damage times the total amount of Energy attached to Gardevoir and the Defending Pokémon.',
    },
  ];

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Gardevoir';

  public fullName: string = 'Gardevoir RS';

  public readonly PSY_SHADOW_MARKER = 'PSY_SHADOW_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.PSY_SHADOW_MARKER, this);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const playerProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, playerProvidedEnergy);
      const playerEnergyCount = playerProvidedEnergy.energyMap.reduce((left, p) => left + p.provides.length, 0);

      const opponentProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, opponentProvidedEnergy);
      const opponentEnergyCount = opponentProvidedEnergy.energyMap.reduce((left, p) => left + p.provides.length, 0);

      effect.damage = (playerEnergyCount + opponentEnergyCount) * 10;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = usePsyShadow(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.PSY_SHADOW_MARKER, this);
    }

    return state;
  }
}
