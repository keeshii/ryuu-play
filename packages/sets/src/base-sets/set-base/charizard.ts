import {
  AttackEffect,
  Card,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseCardsPrompt,
  DiscardCardsEffect,
  Effect,
  EndTurnEffect,
  EnergyCard,
  GameError,
  GameMessage,
  PokemonCard,
  PokemonCardList,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

export class Charizard extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Charmeleon';

  public cardType: CardType = CardType.FIRE;

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
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      
      if (cardList.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (!player.marker.hasMarker(this.ENERGY_BURN_MARKER, this)) {
        player.marker.addMarker(this.ENERGY_BURN_MARKER, this);
      }

      return state;
    }

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.marker.hasMarker(this.ENERGY_BURN_MARKER, this)) {
      effect.energyMap.forEach(item => {
        item.provides = item.provides.map(p => CardType.FIRE);
      });
      effect.source.cards.forEach(c => {
        if (c instanceof EnergyCard && !effect.energyMap.some(e => e.card === c)) {
          effect.energyMap.push({ card: c, provides: c.provides.map(p => CardType.FIRE) });
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let energyCards = 0;
      player.active.cards.forEach(card => {
        if (card.superType === SuperType.ENERGY) {
          energyCards += 1;
        }
      });
 
      if (energyCards === 0) {
        return state;
      }

      const max = Math.min(2, energyCards);
      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.active,
          { superType: SuperType.ENERGY },
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
