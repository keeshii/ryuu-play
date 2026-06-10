import {
  AttackEffect,
  CardType,
  DealDamageEffect,
  Effect,
  EndTurnEffect,
  PlayerType,
  PokemonCard,
  PutDamageEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks, commonMarkers } from '../../common';

export class DarkWartortle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Squirtle';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Doubleslap',
      cost: [CardType.WATER],
      damage: '10×',
      text: 'Flip 2 coins. This attack does 10 damage times the number of heads.'
    },
    {
      name: 'Mirror Shell',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '',
      text:
        'If an attack does damage to Dark Wartortle during your opponent\'s next turn (even if Dark Wartortle is ' +
        'Knocked Out), Dark Wartortle attacks the Defending Pokémon for an equal amount of damage.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Wartortle';

  public fullName: string = 'Dark Wartortle TR';

  public readonly MIRROR_SHELL_USED_MARKER = 'MIRROR_SHELL_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipDamageTimes = commonAttacks.flipDamageTimes(this, store, state, effect);
    const duringOpponentNextTurn = commonMarkers.duringOpponentNextTurn(this, store, state, effect);

    if (effect instanceof PutDamageEffect && effect.target.pokemons.cards.includes(this)) {
      const target = effect.target;
      const player = StateUtils.findOwner(state, target);
      const opponent = StateUtils.getOpponent(state, player);

      if (!duringOpponentNextTurn.hasMarker(effect, target)) {
        return state;
      }

      // Use this marker to prevent infinite loops where Pokemon deal damage each other
      if (target.marker.hasMarker(this.MIRROR_SHELL_USED_MARKER, this)) {
        return state;
      }

      target.marker.addMarker(this.MIRROR_SHELL_USED_MARKER, this);

      const attackEffect = new AttackEffect(player, opponent, this.attacks[1]);
      const dealDamageEffect = new DealDamageEffect(attackEffect, effect.damage);
      dealDamageEffect.target = opponent.active;
      store.reduceEffect(state, dealDamageEffect);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return flipDamageTimes.use(effect, 2, 10);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      duringOpponentNextTurn.setMarker(effect, player.active);
    }

    // Remove markers when the turn is over
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, pokemonSlot => {
        pokemonSlot.marker.removeMarker(this.MIRROR_SHELL_USED_MARKER, this);
      });

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, pokemonSlot => {
        pokemonSlot.marker.removeMarker(this.MIRROR_SHELL_USED_MARKER, this);
      });
    }

    return state;
  }
}
