import {
  AbstractAttackEffect,
  AttackEffect,
  AttackEffects,
  CardType,
  DealDamageEffect,
  Effect,
  EndTurnEffect,
  PlayerType,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Chansey extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 120;

  public attacks = [
    {
      name: 'Scrunch',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, prevent all damage done to Chansey during your opponent\'s next turn. (Any other ' +
        'effects of attacks still happen.) '
    },
    {
      name: 'Double-edge',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '80',
      text: 'Chansey does 80 damage to itself.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Chansey';

  public fullName: string = 'Chansey BS';

  public readonly SCRUNCH_MARKER = 'SCRUNCH_MARKER';

  public readonly CLEAR_SCRUNCH_MARKER = 'CLEAR_SCRUNCH_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AbstractAttackEffect && effect.target.marker.hasMarker(this.SCRUNCH_MARKER, this)) {

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
      player.active.marker.addMarker(this.SCRUNCH_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_SCRUNCH_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 80);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_SCRUNCH_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_SCRUNCH_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        cardList.marker.removeMarker(this.SCRUNCH_MARKER, this);
      });
    }

    return state;
  }
}
