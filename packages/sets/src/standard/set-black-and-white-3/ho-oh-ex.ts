import {
  AttackEffect,
  CardTag,
  CardType,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  Effect,
  EndTurnEffect,
  EnergyCard,
  EnergyType,
  GameError,
  GameMessage,
  PokemonCard,
  PokemonCardList,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useRebirth(
  next: Function,
  store: StoreLike,
  state: State,
  self: HoOhEx,
  effect: PowerEffect
): IterableIterator<State> {
  const player = effect.player;

  // Check if card is in the discard
  if (player.discard.cards.includes(self) === false) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
  if (slots.length === 0) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  // Power already used
  if (player.marker.hasMarker(self.REBIRTH_MAREKER, self)) {
    throw new GameError(GameMessage.POWER_ALREADY_USED);
  }

  player.marker.addMarker(self.REBIRTH_MAREKER, self);

  let flipResult = false;
  yield store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
    flipResult = result;
    next();
  });

  if (flipResult === false) {
    return state;
  }

  player.discard.moveCardTo(self, slots[0]);

  let basicEnergies = 0;
  const typeMap: { [key: number]: boolean } = {};
  player.discard.cards.forEach(c => {
    if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC) {
      const cardType = c.provides[0];
      if (typeMap[cardType] === undefined) {
        basicEnergies += 1;
        typeMap[cardType] = true;
      }
    }
  });

  if (basicEnergies === 0) {
    return state;
  }

  const count = Math.min(3, basicEnergies);
  return store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_ATTACH,
      player.discard,
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      { min: count, max: count, allowCancel: false, differentTypes: true }
    ),
    selected => {
      const cards = selected || [];
      player.discard.moveCardsTo(cards, slots[0]);
    }
  );
}

export class HoOhEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 160;

  public weakness = [{ type: CardType.WATER }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Rebirth',
      useFromDiscard: true,
      powerType: PowerType.ABILITY,
      text:
        'Once during your turn (before your attack), if this Pokémon is ' +
        'in your discard pile, you may flip a coin. If heads, put this Pokémon ' +
        'onto your Bench and attach 3 different types of basic Energy cards ' +
        'from your discard pile to this Pokémon.',
    },
  ];

  public attacks = [
    {
      name: 'Rainbow Burn',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '20+',
      text: 'Does 20 more damage for each different type of basic Energy attached to this Pokémon.',
    },
  ];

  public set: string = 'BW3';

  public name: string = 'Ho-Oh EX';

  public fullName: string = 'Ho-Oh EX DGE';

  public readonly REBIRTH_MAREKER = 'REBIRTH_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let basicEnergies = 0;
      const typeMap: { [key: number]: boolean } = {};
      player.active.cards.forEach(c => {
        if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC) {
          const cardType = c.provides[0];
          if (typeMap[cardType] === undefined) {
            basicEnergies += 1;
            typeMap[cardType] = true;
          }
        }
      });

      effect.damage += basicEnergies * 20;
      return state;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useRebirth(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.REBIRTH_MAREKER, this);
    }

    return state;
  }
}
