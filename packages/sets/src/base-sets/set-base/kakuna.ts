import {
  AbstractAttackEffect,
  AddSpecialConditionsEffect,
  AttackEffect,
  AttackEffects,
  CardType,
  CoinFlipPrompt,
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

export class Kakuna extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Weedle';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public attacks = [
    {
      name: 'Stiffen',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, prevent all damage done to Kakuna during your opponent\'s next turn. (Any other ' +
        'effects of attacks still happen.) '
    },
    {
      name: 'Poisonpowder',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Kakuna';

  public fullName: string = 'Kakuna BS';
  
  public readonly STIFFEN_MARKER = 'STIFFEN_MARKER';
  
  public readonly CLEAR_STIFFEN_MARKER = 'CLEAR_STIFFEN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AbstractAttackEffect && effect.target.marker.hasMarker(this.STIFFEN_MARKER, this)) {

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
      player.active.marker.addMarker(this.STIFFEN_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_STIFFEN_MARKER, this);
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

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_STIFFEN_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_STIFFEN_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        cardList.marker.removeMarker(this.STIFFEN_MARKER, this);
      });
    }

    return state;
  }
}
