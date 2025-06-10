import {
  AttackEffect,
  CardType,
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

export class Onix extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 90;

  public attacks = [
    {
      name: 'Rock Throw',
      cost: [CardType.FIGHTING],
      damage: '10',
      text: ''
    },
    {
      name: 'Harden',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: '',
      text:
        'During your opponent\'s next turn, whenever 30 or less damage is done to Onix (after applying Weakness and ' +
        'Resistance), prevent that damage. (Any other effects of attacks still happen.)'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Onix';

  public fullName: string = 'Onix BS';

  public readonly HARDEN_MARKER = 'HARDEN_MARKER';
  
  public readonly CLEAR_HARDEN_MARKER = 'CLEAR_HARDEN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && effect.target.marker.hasMarker(this.HARDEN_MARKER, this)) {
      if (effect.damage <= 30) {
        effect.preventDefault = true;
      }
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.marker.addMarker(this.HARDEN_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_HARDEN_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_HARDEN_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_HARDEN_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, pokemonSlot => {
        pokemonSlot.marker.removeMarker(this.HARDEN_MARKER, this);
      });
    }

    return state;
  }
}
