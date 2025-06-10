import {
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  EndTurnEffect,
  GameMessage,
  PlayerType,
  PokemonCard,
  PutDamageEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Buneary extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 50;

  public weakness = [
    {
      type: CardType.FIGHTING,
      value: 10,
    },
  ];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Dizzy Punch',
      cost: [CardType.COLORLESS],
      damage: '10×',
      text: 'Flip 2 coins. This attack does 10 damage times the number of heads.',
    },
    {
      name: 'Defense Curl',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, prevent all damage done to Buneary by attacks during your opponent\'s next turn.',
    },
  ];

  public set: string = 'OP9';

  public name: string = 'Buneary';

  public fullName: string = 'Buneary OP9';

  public readonly CLEAR_DEFENSE_CURL_MARKER = 'CLEAR_DEFENSE_CURL_MARKER';

  public readonly DEFENSE_CURL_MARKER = 'DEFENSE_CURL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(
        state,
        [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)],
        results => {
          let heads: number = 0;
          results.forEach(r => {
            heads += r ? 1 : 0;
          });
          effect.damage = 10 * heads;
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), flipResult => {
        if (flipResult) {
          player.active.marker.addMarker(this.DEFENSE_CURL_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_DEFENSE_CURL_MARKER, this);
        }
      });
    }

    if (effect instanceof PutDamageEffect && effect.target.marker.hasMarker(this.DEFENSE_CURL_MARKER)) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_DEFENSE_CURL_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_DEFENSE_CURL_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, pokemonSlot => {
        pokemonSlot.marker.removeMarker(this.DEFENSE_CURL_MARKER, this);
      });
    }

    return state;
  }
}
