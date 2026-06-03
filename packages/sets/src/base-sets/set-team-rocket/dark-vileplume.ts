import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameError,
  GameMessage,
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

export class DarkVileplume extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Dark Gloom';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public powers = [
    {
      name: 'Hay Fever',
      powerType: PowerType.POKEPOWER,
      text:
        'No Trainer cards can be played. This power stops working while Dark Vileplume is Asleep, Confused, or ' +
        'Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Petal Whirlwind',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS],
      damage: '30×',
      text:
        'Flip 3 coins. This attack does 30 damage times the number of heads. If you get 2 or more heads, Dark ' +
        'Vileplume is now Confused (after doing damage).'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Vileplume';

  public fullName: string = 'Dark Vileplume TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Block trainer cards
    if (effect instanceof PlayItemEffect) {
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (pokemonSlot === undefined
        || pokemonSlot.getPokemonCard() !== this
        || pokemonSlot.specialConditions.includes(SpecialCondition.ASLEEP)
        || pokemonSlot.specialConditions.includes(SpecialCondition.CONFUSED)
        || pokemonSlot.specialConditions.includes(SpecialCondition.PARALYZED)) {
        return state;
      }

      const player = StateUtils.findOwner(state, pokemonSlot);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(
        state,
        [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), 
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
        ],
        results => {
          let heads: number = 0;
          results.forEach(r => {
            heads += r ? 1 : 0;
          });
          if (heads >= 2) {
            const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
            specialConditionEffect.target = player.active;
            store.reduceEffect(state, specialConditionEffect);
          }
          effect.damage = 30 * heads;
        }
      );
    }

    return state;
  }
}
