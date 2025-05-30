import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  EndTurnEffect,
  GameMessage,
  GamePhase,
  KnockOutEffect,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Gastly extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

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
        'Discard 1 Psychic Energy card attached to Gastly in order to use this attack. If a Pokémon Knocks Out ' +
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
  
  public readonly DESTINY_BOND_1_MARKER = 'DESTINY_BOND_1_MARKER';

  public readonly DESTINY_BOND_2_MARKER = 'DESTINY_BOND_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
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
      player.active.marker.addMarker(this.DESTINY_BOND_1_MARKER, this);
      player.active.marker.addMarker(this.DESTINY_BOND_2_MARKER, this);
      player.active.damage = 0;
    }

    if (effect instanceof EndTurnEffect) {
      const marker = effect.player.active.marker;
      if (marker.hasMarker(this.DESTINY_BOND_2_MARKER, this)) {
        marker.removeMarker(this.DESTINY_BOND_2_MARKER);
      } else if (marker.hasMarker(this.DESTINY_BOND_1_MARKER, this)) {
        marker.removeMarker(this.DESTINY_BOND_1_MARKER);
      }
    }

    if (effect instanceof KnockOutEffect && effect.target.marker.hasMarker(this.DESTINY_BOND_1_MARKER, this)) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      if (player === targetPlayer) {
        return state;
      }

      const knockOutEffect = new KnockOutEffect(player, player.active);
      store.reduceEffect(state, knockOutEffect);
    }

    return state;
  }
}
