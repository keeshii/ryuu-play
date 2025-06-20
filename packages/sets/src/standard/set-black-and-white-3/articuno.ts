import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  GamePhase,
  KnockOutEffect,
  PokemonCard,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Articuno extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 120;

  public weakness = [{ type: CardType.METAL }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Delta Plus',
      powerType: PowerType.ANCIENT_TRAIT,
      text:
        'If your opponent\'s Pokémon is Knocked Out by damage from an ' +
        'attack of this Pokémon, take 1 more Prize card.',
    },
  ];

  public attacks = [
    {
      name: 'Chilling Sigh',
      cost: [CardType.WATER],
      damage: '',
      text: 'Your opponent\'s Active Pokémon is now Asleep.',
    },
    {
      name: 'Tri Edge',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: '20+',
      text: 'Flip 3 coins. This attack does 40 more damage for each heads.',
    },
  ];

  public set: string = 'BW3';

  public name: string = 'Articuno';

  public fullName: string = 'Articuno ROS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      return store.prompt(
        state,
        [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        ],
        results => {
          let heads: number = 0;
          results.forEach(r => {
            heads += r ? 1 : 0;
          });
          effect.damage += 40 * heads;
        }
      );
    }

    // Delta Plus
    if (effect instanceof KnockOutEffect && effect.target === effect.player.active) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      // Articuno wasn't attacking
      const pokemonCard = opponent.active.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }

      effect.prizeCount += 1;
      return state;
    }

    return state;
  }
}
