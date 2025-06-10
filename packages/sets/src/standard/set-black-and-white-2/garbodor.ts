import {
  CardType,
  Effect,
  GameError,
  GameMessage,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Garbodor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Trubbish';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 100;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Garbotoxin',
      powerType: PowerType.ABILITY,
      text:
        'If this Pokémon has a Pokémon Tool card attached to it, ' +
        'each Pokémon in play, in each player\'s hand, and in each ' +
        'player\'s discard pile has no Abilities (except for Garbotoxin).',
    },
  ];

  public attacks = [
    {
      name: 'Sludge Toss',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: '60',
      text: '',
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Garbodor';

  public fullName: string = 'Garbodor DGE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (
      effect instanceof PowerEffect &&
      effect.power.powerType === PowerType.ABILITY &&
      effect.power.name !== 'Garbotoxin'
    ) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isGarbodorWithToolInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, card) => {
        if (card === this && pokemonSlot.getTools().length > 0) {
          isGarbodorWithToolInPlay = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (pokemonSlot, card) => {
        if (card === this && pokemonSlot.getTools().length > 0) {
          isGarbodorWithToolInPlay = true;
        }
      });

      if (!isGarbodorWithToolInPlay) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    return state;
  }
}
