import {
  AttackEffect,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  Effect,
  EnergyCard,
  GameError,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

import { commonMarkers } from '../../common';

function* useFanAway(next: Function, store: StoreLike, state: State, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  
  let flipResult = false;
  yield store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
    flipResult = result;
    next();
  });

  if (!flipResult) {
    return state;
  }

  return store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      opponent.active.energies,
      { },
      { min: 1, max: 1, allowCancel: false }
    ),
    selected => {
      const cards = (selected || []) as EnergyCard[];
      opponent.active.energies.moveCardsTo(cards, opponent.hand);
    }
  );
}

export class Shiftry extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Nuzleaf';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 120;

  public powers = [
    {
      name: 'Fan Away',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may flip a coin. If heads, return 1 Energy card attached ' +
        'to the Defending Pokémon to your opponent\'s hand. This power can\'t be used if Shiftry is affected by a ' +
        'Special Condition.'
    },
  ];

  public attacks = [
    {
      name: 'Light Touch Throw',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '80-',
      text: 'Does 80 damage minus 10 damage for each Energy attached to the Defending Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Shiftry';

  public fullName: string = 'Shiftry SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const powerUseOnce = commonMarkers.powerUseOnce(this, store, state, effect);
    
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (!pokemonSlot || pokemonSlot.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (opponent.active.energies.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (powerUseOnce.hasMarker(effect)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      powerUseOnce.setMarker(effect);

      const generator = useFanAway(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      state = store.reduceEffect(state, checkProvidedEnergy);
      const energyCount = checkProvidedEnergy.energyMap.reduce((left, p) => left + p.provides.length, 0);

      effect.damage -= energyCount * 10;
      return state;
    }

    return state;
  }
}
