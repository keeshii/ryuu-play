import {
  AttachEnergyPrompt,
  AttackEffect,
  CardTarget,
  CardType,
  CheckHpEffect,
  CheckProvidedEnergyEffect,
  CoinFlipPrompt,
  DealDamageEffect,
  Effect,
  EnergyCard,
  EnergyType,
  GameError,
  GameLog,
  GameMessage,
  PlayerType,
  PlayPokemonEffect,
  PokemonCard,
  PokemonSlot,
  PowerEffect,
  PowerType,
  SelectPrompt,
  SlotType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

const VALUE_TO_TYPE: { [key: string]: CardType } = {
  'C': CardType.COLORLESS,
  'G': CardType.GRASS,
  'R': CardType.FIRE,
  'F': CardType.FIGHTING,
  'P': CardType.PSYCHIC,
  'W': CardType.WATER,
  'L': CardType.LIGHTNING,
  'M': CardType.METAL,
  'D': CardType.DARK,
  'N': CardType.DRAGON,
  'Y': CardType.FAIRY
};

const promptOptions: { message: GameMessage, value: string }[] = [
  { message: GameMessage.TYPE_GRASS, value: 'G' },
  { message: GameMessage.TYPE_FIRE, value: 'R' },
  { message: GameMessage.TYPE_FIGHTING, value: 'F' },
  { message: GameMessage.TYPE_PSYCHIC, value: 'P' },
  { message: GameMessage.TYPE_WATER, value: 'W' },
  { message: GameMessage.TYPE_LIGHTNING, value: 'L' },
  { message: GameMessage.TYPE_METAL, value: 'M' },
  { message: GameMessage.TYPE_DARK, value: 'D' },
  { message: GameMessage.TYPE_DRAGON, value: 'N' },
  { message: GameMessage.TYPE_FAIRY, value: 'Y' },
];

function* useBuzzap(next: Function, store: StoreLike, state: State, self: Electrode, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  const pokemonSlot = StateUtils.findPokemonSlot(state, self);

  if (pokemonSlot === undefined
    || pokemonSlot.specialConditions.includes(SpecialCondition.ASLEEP)
    || pokemonSlot.specialConditions.includes(SpecialCondition.CONFUSED)
    || pokemonSlot.specialConditions.includes(SpecialCondition.PARALYZED)) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  let hasAnyOtherPokemon = false;
  const blockedTo: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, card, target) => {
    if (pokemonSlot === slot) {
      blockedTo.push(target);
    } else {
      hasAnyOtherPokemon = true;
    }
  });

  if (!hasAnyOtherPokemon) {
    return state;
  }

  const blocked: number[] = [];
  pokemonSlot.pokemons.cards.forEach((card, index) => {
    if (card !== self) {
      blocked.push(index);
    }
  });

  let choice: number = -1;
  yield store.prompt(
    state,
    new SelectPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TYPE,
      promptOptions.map(p => p.message),
      { allowCancel: true }
    ),
    result => {
      if (result !== null) {
        choice = result;
      }
      next();
    }
  );

  if (choice === -1) {
    return state;
  }

  let target: PokemonSlot | undefined;
  yield store.prompt(
    state,
    new AttachEnergyPrompt(
      player.id,
      GameMessage.ATTACH_ENERGY_CARDS,
      pokemonSlot.pokemons,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.BENCH, SlotType.ACTIVE],
      {},
      { allowCancel: true, blockedTo, blocked }
    ),
    transfers => {
      transfers = transfers || [];
      if (transfers.length > 0) {
        target = StateUtils.getTarget(state, player, transfers[0].to);
      }
      next();
    }
  );

  if (target === undefined) {
    return state;
  }

  const checkHpEffect = new CheckHpEffect(player, pokemonSlot);
  store.reduceEffect(state, checkHpEffect);
  pokemonSlot.damage = Math.max(checkHpEffect.hp, pokemonSlot.damage);

  // Wait for Knock Out
  yield store.waitPrompt(state, () => next());

  // First let's check where the Electrode is not (Rescue Energy, etc)
  const cardList = StateUtils.findCardList(state, self);
  cardList.moveCardTo(self, target.energies);

  const value = promptOptions[choice].value;
  const message = promptOptions[choice].message;
  store.log(state, GameLog.LOG_PLAYER_CHANGES_TYPE_TO, { name: player.name, message });

  // Remove old markers
  const markers = player.active.marker.markers.filter(c => c.source === self);
  for (const marker of markers) {
    player.marker.removeMarker(marker.name, marker.source);
  }

  // Add marker with the new type
  player.marker.addMarker(self.BUZZAPP_MARKER + value, self);
  return state;
}

export class Electrode extends PokemonCard implements EnergyCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Voltorb';

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 80;

  public powers = [
    {
      name: 'Buzzap',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'At any time during your turn (before your attack), you may Knock Out Electrode and attach it to 1 of your ' +
        'other Pokémon. If you do, choose a type of Energy. Electrode is now an Energy card (instead of a Pokémon) ' +
        'that provides 2 energy of that type. You can\'t use this power if Electrode is Asleep, Confused, or ' +
        'Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Electric Shock',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING],
      damage: '50',
      text: 'Flip a coin. If tails, Electrode does 10 damage to itself.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Electrode';

  public fullName: string = 'Electrode BS';

  public readonly BUZZAPP_MARKER = 'BUZZAPP_MARKER_';

  public text = ''; // Unused

  public provides: CardType[] = [];

  public energyType = EnergyType.SPECIAL;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const markers = player.active.marker.markers.filter(c => c.source === this);
      for (const marker of markers) {
        player.marker.removeMarker(marker.name, marker.source);
      }
    }

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.energies.cards.includes(this)) {
      const player = effect.player;
      
      const marker = player.marker.markers.find(c => c.name.startsWith(this.BUZZAPP_MARKER) && c.source === this);
      if (!marker) {
        return state;
      }
      const cardType: CardType = VALUE_TO_TYPE[marker.name.slice(-1)];
      if (!cardType) {
        return state;
      }

      effect.energyMap.forEach(item => {
        if (item.card === this) {
          item.provides = [cardType, cardType];
        }
      });
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useBuzzap(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === false) {
          const dealDamage = new DealDamageEffect(effect, 10);
          dealDamage.target = player.active;
          store.reduceEffect(state, dealDamage);
        }
      });
    }

    return state;
  }
}
