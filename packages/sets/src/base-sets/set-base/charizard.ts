import {
  AttackEffect,
  Card,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseCardsPrompt,
  DiscardCardsEffect,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Charizard extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Charmeleon';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 120;

  public powers = [
    {
      name: 'Energy Burn',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'As often as you like during your turn (before your attack), you may turn all Energy attached to Charizard ' +
        'into R Energy for the rest of the turn. This power can\'t be used if Charizard is Asleep, Confused, or ' +
        'Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Fire Spin',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE],
      damage: '100',
      text: 'Discard 2 Energy cards attached to Charizard in order to use this attack.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Charizard';

  public fullName: string = 'Charizard BS';
  
  public readonly ENERGY_BURN_MARKER = 'ENERGY_BURN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);
      
      if (pokemonSlot === undefined
        || pokemonSlot.specialConditions.includes(SpecialCondition.ASLEEP)
        || pokemonSlot.specialConditions.includes(SpecialCondition.CONFUSED)
        || pokemonSlot.specialConditions.includes(SpecialCondition.PARALYZED)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (!player.marker.hasMarker(this.ENERGY_BURN_MARKER, this)) {
        player.marker.addMarker(this.ENERGY_BURN_MARKER, this);
      }

      return state;
    }

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.pokemons.cards.includes(this)) {
      if (!effect.player.marker.hasMarker(this.ENERGY_BURN_MARKER, this)) {
        return state;
      }

      effect.energyMap.forEach(item => {
        item.provides = item.provides.map(p => CardType.FIRE);
      });
      effect.source.energies.cards.forEach(c => {
        if (!effect.energyMap.some(e => e.card === c)) {
          effect.energyMap.push({ card: c, provides: c.provides.map(p => CardType.FIRE) });
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const energyCards = player.active.energies.cards.length;
      if (energyCards === 0) {
        return state;
      }

      const max = Math.min(2, energyCards);
      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.active.energies,
          { },
          { min: max, max, allowCancel: false }
        ),
        selected => {
          const cards: Card[] = selected || [];
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);
        }
      );
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ENERGY_BURN_MARKER, this)) {
      effect.player.marker.removeMarker(this.ENERGY_BURN_MARKER, this);
    }

    return state;
  }
}
