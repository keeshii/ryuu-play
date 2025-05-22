import {
  AttackEffect,
  CardType,
  Effect,
  PlayerType,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Lucario extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Riolu';

  public cardType: CardType = CardType.METAL;

  public hp: number = 110;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Vacuum Wave',
      cost: [CardType.METAL],
      damage: '50',
      text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.',
    },
    {
      name: 'Fight Alone',
      cost: [CardType.METAL, CardType.COLORLESS],
      damage: '30+',
      text:
        'If you have fewer Pokémon in play than your opponent, this ' +
        'attack does 60 more damage for each Pokémon fewer you have in play.',
    },
  ];

  public set: string = 'BW4';

  public name: string = 'Lucario';

  public fullName: string = 'Lucario FCO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.ignoreWeakness = true;
      effect.ignoreResistance = true;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let playerPokemons = 0;
      let opponentPokemons = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, () => {
        playerPokemons += 1;
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, () => {
        opponentPokemons += 1;
      });

      const fewerPokemons = Math.max(0, opponentPokemons - playerPokemons);
      effect.damage += fewerPokemons * 60;
    }

    return state;
  }
}
