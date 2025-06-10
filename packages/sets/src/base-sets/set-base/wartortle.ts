import {
  AbstractAttackEffect,
  AttackEffect,
  AttackEffects,
  CardType,
  CoinFlipPrompt,
  Effect,
  EndTurnEffect,
  GameMessage,
  PlayerType,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Wartortle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Squirtle';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Withdraw',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, prevent all damage done to Wartortle during your opponent\'s next turn. (Any other ' +
        'effects of attacks still happen.)'
    },
    {
      name: 'Bite',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Wartortle';

  public fullName: string = 'Wartortle BS';

  public readonly WITHDRAW_MARKER = 'WITHDRAW_MARKER';

  public readonly CLEAR_WITHDRAW_MARKER = 'CLEAR_WITHDRAW_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AbstractAttackEffect && effect.target.marker.hasMarker(this.WITHDRAW_MARKER, this)) {

      // Block effects that inflict damage
      const damageEffects: string[] = [
        AttackEffects.APPLY_WEAKNESS_EFFECT,
        AttackEffects.DEAL_DAMAGE_EFFECT,
        AttackEffects.PUT_DAMAGE_EFFECT,
        AttackEffects.AFTER_DAMAGE_EFFECT,
        // AttackEffects.PUT_COUNTERS_EFFECT, <-- This is not damage
      ];

      if (damageEffects.includes(effect.type)) {
        effect.preventDefault = true;
      }

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          player.active.marker.addMarker(this.WITHDRAW_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_WITHDRAW_MARKER, this);
        }
      });
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_WITHDRAW_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_WITHDRAW_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, pokemonSlot => {
        pokemonSlot.marker.removeMarker(this.WITHDRAW_MARKER, this);
      });
    }

    return state;
  }

}
