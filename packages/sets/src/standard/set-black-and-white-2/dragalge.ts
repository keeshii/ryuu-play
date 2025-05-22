import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameError,
  GameMessage,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  RetreatEffect,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Dragalge extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Skrelp';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 100;

  public weakness = [{ type: CardType.FAIRY }];

  public retreat = [CardType.COLORLESS];

  public powers = [
    {
      name: 'Poison Barrier',
      powerType: PowerType.ABILITY,
      text: 'Your opponent\'s Poisoned Pokémon can\'t retreat.',
    },
  ];

  public attacks = [
    {
      name: 'Poison Breath',
      cost: [CardType.WATER, CardType.PSYCHIC, CardType.COLORLESS],
      damage: '60',
      text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Poisoned.',
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Dragalge';

  public fullName: string = 'Dragalge FLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    // Block retreat for opponent's poisoned Pokemon.
    if (effect instanceof RetreatEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const isPoisoned = player.active.specialConditions.includes(SpecialCondition.POISONED);
      if (!isPoisoned) {
        return state;
      }

      let isDragalgeInPlay = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isDragalgeInPlay = true;
        }
      });

      if (isDragalgeInPlay) {
        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(opponent, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    return state;
  }
}
