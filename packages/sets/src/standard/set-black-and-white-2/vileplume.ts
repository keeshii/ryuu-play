import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameError,
  GameMessage,
  PlayerType,
  PlayItemEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Vileplume extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Gloom';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 120;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Allergy Flower',
      powerType: PowerType.POKEBODY,
      text: 'Each player can\'t play any Trainer cards from his or her hand.',
    },
  ];

  public attacks = [
    {
      name: 'Dazzling Pollen',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: '50+',
      text:
        'Flip a coin. If heads, this attack does 50 damage plus 20 more ' +
        'damage. If tails, the Defending Pokémon is now Confused.',
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Vileplume';

  public fullName: string = 'Vileplume UND';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result) {
          effect.damage += 20;
        } else {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    // Block trainer cards
    if (effect instanceof PlayItemEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isVileplumeInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, card) => {
        if (card === this) {
          isVileplumeInPlay = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (pokemonSlot, card) => {
        if (card === this) {
          isVileplumeInPlay = true;
        }
      });

      if (!isVileplumeInPlay) {
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
