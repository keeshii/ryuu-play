import {
  AbstractAttackEffect,
  AttackEffect,
  CardTag,
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

export class ScytherEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Agility',
      cost: [CardType.GRASS],
      damage: '10',
      text:
        'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Scyther ex during your ' +
        'opponent\'s next turn.',
    },
    {
      name: 'Slash',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: '50',
      text: '',
    },
  ];

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Scyther ex';

  public fullName: string = 'Scyther ex RS';

  public readonly AGILITY_MARKER = 'AGILITY_MARKER';

  public readonly CLEAR_AGILITY_MARKER = 'CLEAR_AGILITY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          player.active.marker.addMarker(this.AGILITY_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_AGILITY_MARKER, this);
        }
      });
    }

    if (effect instanceof AbstractAttackEffect && effect.target.marker.hasMarker(this.AGILITY_MARKER, this)) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_AGILITY_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_AGILITY_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, pokemonSlot => {
        pokemonSlot.marker.removeMarker(this.AGILITY_MARKER, this);
      });
    }

    return state;
  }
}
