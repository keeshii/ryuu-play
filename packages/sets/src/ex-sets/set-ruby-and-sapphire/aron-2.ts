import {
  AttackEffect,
  CardType,
  Effect,
  EndTurnEffect,
  GamePhase,
  PlayerType,
  PokemonCard,
  PutDamageEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Aron2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 40;

  public attacks = [
    {
      name: 'Teary Eyes',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'During your opponent\'s next turn, any damage done to Aron by attacks is reduced by 10.',
    },
    {
      name: 'Ram',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: '',
    },
  ];

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Aron';

  public fullName: string = 'Aron RS-2';

  public readonly TEARY_EYES_MARKER = 'TEARY_EYES_MARKER';

  public readonly CLEAR_TEARY_EYES_MARKER = 'CLEAR_TEARY_EYES_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.TEARY_EYES_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_TEARY_EYES_MARKER, this);
      return state;
    }

    // Reduce damage by 10
    if (effect instanceof PutDamageEffect && effect.target.marker.hasMarker(this.TEARY_EYES_MARKER, this)) {
      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      effect.damage -= 10;
      return state;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_TEARY_EYES_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_TEARY_EYES_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        cardList.marker.removeMarker(this.TEARY_EYES_MARKER, this);
      });
    }

    return state;
  }
}
