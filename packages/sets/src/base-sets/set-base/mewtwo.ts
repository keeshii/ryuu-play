import {
  AbstractAttackEffect,
  AddSpecialConditionsEffect,
  AttackEffect,
  Card,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseEnergyPrompt,
  CoinFlipPrompt,
  DiscardCardsEffect,
  Effect,
  EndTurnEffect,
  GameMessage,
  PlayerType,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Mewtwo extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public attacks = [
    {
      name: 'Psychic',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '10+',
      text: 'Does 10 damage plus 10 more damage for each Energy card attached to the Defending Pokémon.'
    },
    {
      name: 'Barrier',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: '',
      text:
        'Discard 1 Psychic Energy card attached to Mewtwo in order to prevent all effects of attacks, including ' +
        'damage, done to Mewtwo during your opponent\'s next turn. '
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Mewtwo';

  public fullName: string = 'Mewtwo BS';

  public readonly BARRIER_MARKER = 'BARRIER_MARKER';
  
  public readonly CLEAR_BARRIER_MARKER = 'CLEAR_BARRIER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AbstractAttackEffect && effect.target.marker.hasMarker(this.BARRIER_MARKER, this)) {
      // Block all effects, including damage
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const providedEnergy = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, providedEnergy);
      const energyCount = providedEnergy.energyMap.reduce((left, p) => left + p.provides.length, 0);

      effect.damage += energyCount * 10;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(
        state,
        new ChooseEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          checkProvidedEnergy.energyMap,
          [CardType.PSYCHIC],
          { allowCancel: false }
        ),
        energy => {
          const cards: Card[] = (energy || []).map(e => e.card);
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);
          
          player.active.marker.addMarker(this.BARRIER_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_BARRIER_MARKER, this);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_BARRIER_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_BARRIER_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        cardList.marker.removeMarker(this.BARRIER_MARKER, this);
      });
    }

    return state;
  }
}
