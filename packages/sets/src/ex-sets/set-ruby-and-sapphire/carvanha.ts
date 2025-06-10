import {
  AddMarkerEffect,
  AfterDamageEffect,
  AttackEffect,
  CardType,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  GamePhase,
  PokemonCard,
  PowerEffect,
  PowerType,
  RetreatEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Carvanha extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 40;

  public powers = [
    {
      name: 'Rough Skin',
      powerType: PowerType.POKEBODY,
      text:
        'If Carvanha is your Active Pokémon and is damaged by an opponent\'s attack (even if Carvanha is Knocked ' +
        'Out), put 1 damage counter on the Attacking Pokémon.',
    },
  ];

  public attacks = [
    {
      name: 'Big Bite',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: 'The Defending Pokémon can\'t retreat until the end of your opponent\'s next turn.',
    },
  ];

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Carvanha';

  public fullName: string = 'Carvanha RS';

  public readonly BIG_BITE_MARKER = 'BIG_BITE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterDamageEffect && effect.target.pokemons.cards.includes(this)) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      // No damage, or damage done by itself, or Carvanha is not active
      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
        return state;
      }

      // Pokemon is evolved, Not an attack
      if (effect.target.getPokemonCard() !== this || state.phase !== GamePhase.ATTACK) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.source.damage += 10;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const addMarkerEffect = new AddMarkerEffect(effect, this.BIG_BITE_MARKER, this);
      return store.reduceEffect(state, addMarkerEffect);
    }

    // Block retreat for opponent's Pokemon with marker.
    if (effect instanceof RetreatEffect) {
      const player = effect.player;

      const hasMarker = player.active.marker.hasMarker(this.BIG_BITE_MARKER);
      if (!hasMarker) {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.BIG_BITE_MARKER, this);
    }

    return state;
  }
}
