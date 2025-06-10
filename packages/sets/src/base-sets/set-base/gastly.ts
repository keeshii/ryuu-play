import {
  AddSpecialConditionsEffect,
  AfterDamageEffect,
  AttackEffect,
  Card,
  CardType,
  CheckHpEffect,
  CheckProvidedEnergyEffect,
  ChooseEnergyPrompt,
  CoinFlipPrompt,
  DiscardCardsEffect,
  Effect,
  EndTurnEffect,
  GameMessage,
  GamePhase,
  PlayerType,
  PokemonCard,
  PutCountersEffect,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Gastly extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 30;

  public attacks = [
    {
      name: 'Sleeping Gas',
      cost: [CardType.PSYCHIC],
      damage: '',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep.'
    },
    {
      name: 'Destiny Bond',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '',
      text:
        'Discard 1 P Energy card attached to Gastly in order to use this attack. If a Pokémon Knocks Out ' +
        'Gastly during your opponent\'s next turn, Knock Out that Pokémon.'
    },
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'BS';

  public name: string = 'Gastly';

  public fullName: string = 'Gastly BS';

  public readonly DESTINY_BOND_MARKER = 'DESTINY_BOND_MARKER';

  public readonly CLEAR_DESTINY_BOND_MARKER = 'CLEAR_DESTINY_BOND_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AfterDamageEffect && effect.target.marker.hasMarker(this.DESTINY_BOND_MARKER, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      if (opponent.active !== effect.target) {
        return state;
      }

      const checkHpEffect1 = new CheckHpEffect(player, effect.target);
      store.reduceEffect(state, checkHpEffect1);

      // Check if Pokemon is KO by comparing HP and damage
      if (checkHpEffect1.hp <= effect.target.damage) {
        const checkHpEffect2 = new CheckHpEffect(player, player.active);
        store.reduceEffect(state, checkHpEffect2);
        const hpLeft = Math.max(0, checkHpEffect2.hp - player.active.damage);

        // Put Counters equal to HP left (Knock Out)
        const putCountersEffect = new PutCountersEffect(effect.attackEffect, hpLeft);
        putCountersEffect.target = player.active;
        store.reduceEffect(state, putCountersEffect);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      return store.prompt(
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

          player.active.marker.addMarker(this.DESTINY_BOND_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_DESTINY_BOND_MARKER, this);
        }
      );
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_DESTINY_BOND_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_DESTINY_BOND_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, pokemonSlot => {
        pokemonSlot.marker.removeMarker(this.DESTINY_BOND_MARKER, this);
      });
    }

    return state;
  }
}
