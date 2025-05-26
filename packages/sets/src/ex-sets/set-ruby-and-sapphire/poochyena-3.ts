import {
  AddMarkerEffect,
  AttackEffect,
  CardType,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  PokemonCard,
  RetreatEffect,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Poochyena3 extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 50;

  public attacks = [
    {
      name: 'Shadow Bind',
      cost: [CardType.DARK],
      damage: '10',
      text: 'The Defending Pokémon can\'t retreat until the end of your opponent\'s next turn.',
    },
  ];

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Poochyena';

  public fullName: string = 'Poochyena RS-3';

  public readonly SHADOW_BIND_MARKER = 'SHADOW_BIND_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const addMarkerEffect = new AddMarkerEffect(effect, this.SHADOW_BIND_MARKER, this);
      return store.reduceEffect(state, addMarkerEffect);
    }

    // Block retreat for opponent's Pokemon with marker.
    if (effect instanceof RetreatEffect) {
      const player = effect.player;

      const hasMarker = player.active.marker.hasMarker(this.SHADOW_BIND_MARKER);
      if (!hasMarker) {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.SHADOW_BIND_MARKER, this);
    }

    return state;
  }
}
