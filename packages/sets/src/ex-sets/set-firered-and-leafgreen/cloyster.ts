import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  GamePhase,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Cloyster extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Shellder';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 70;

  public powers = [
    {
      name: 'Exoskeleton',
      powerType: PowerType.POKEBODY,
      text: 'Any damage done to Cloyster by attacks is reduced by 20 (after applying Weakness and Resistance).'
    },
  ];

  public attacks = [
    {
      name: 'Double Bubble',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '10×',
      text:
        'Flip 2 coins. This attack does 10 damage times the number of heads. If either of the coins is heads, the ' +
        'Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Shell Attack',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Cloyster';

  public fullName: string = 'Cloyster RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Reduce damage by 20
    if (effect instanceof PutDamageEffect && effect.target.pokemons.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      // Not an attack, or it's not this pokemon card
      if (state.phase !== GamePhase.ATTACK || pokemonCard !== this) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.damage = Math.max(0, effect.damage - 20);
    }

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
          if (heads > 0) {
            const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
            store.reduceEffect(state, specialConditionEffect);
          }
        }
      );
    }

    return state;
  }
}
