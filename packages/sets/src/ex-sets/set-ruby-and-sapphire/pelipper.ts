import {
  AfterDamageEffect,
  AttackEffect,
  CardType,
  Effect,
  EndTurnEffect,
  HealTargetEffect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Pelipper extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Wingull';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Stockpile',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'During your next turn, Spit Up\'s base damage is 70 instead of 30, and Swallow\'s base damage is 60 instead ' +
        'of 20.',
    },
    {
      name: 'Spit Up',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '30',
      text: '',
    },
    {
      name: 'Swallow',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text:
        'After your attack, remove from Pelipper the number of damage counters equal to the damage you did to the ' +
        'Defending Pokémon. If Pelipper has fewer damage counters than that, remove all of them.',
    },
  ];

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Pelipper';

  public fullName: string = 'Pelipper RS';

  public readonly STOCKPILE_1_MARKER = 'STOCKPILE_1_MARKER';

  public readonly STOCKPILE_2_MARKER = 'STOCKPILE_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      player.active.marker.addMarker(this.STOCKPILE_1_MARKER, this);
      player.active.marker.addMarker(this.STOCKPILE_2_MARKER, this);
      player.active.damage = 0;
      return state;
    }

    if (effect instanceof AttackEffect && effect.player.active.marker.hasMarker(this.STOCKPILE_1_MARKER, this)) {
      if (effect.attack === this.attacks[1]) {
        effect.damage = 70;
      }
      if (effect.attack === this.attacks[2]) {
        effect.damage = 60;
      }
    }

    if (effect instanceof AfterDamageEffect && effect.attack === this.attacks[2]) {
      const player = effect.player;
      const healEffect = new HealTargetEffect(effect.attackEffect, effect.damage);
      healEffect.target = player.active;
      return store.reduceEffect(state, healEffect);
    }

    if (effect instanceof EndTurnEffect) {
      const marker = effect.player.active.marker;
      if (marker.hasMarker(this.STOCKPILE_2_MARKER, this)) {
        marker.removeMarker(this.STOCKPILE_2_MARKER);
      } else if (marker.hasMarker(this.STOCKPILE_1_MARKER, this)) {
        marker.removeMarker(this.STOCKPILE_1_MARKER);
      }
    }

    return state;
  }
}
