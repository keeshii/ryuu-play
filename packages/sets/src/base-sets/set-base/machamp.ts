import {
  AfterDamageEffect,
  CardType,
  Effect,
  GameError,
  GameMessage,
  GamePhase,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Machamp extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Machoke';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 100;

  public powers = [
    {
      name: 'Strikes Back',
      powerType: PowerType.POKEPOWER,
      text:
        'Whenever your opponent\'s attack damages Machamp (even if Machamp is Knocked Out), this power does 10 ' +
        'damage to the attacking Pokémon. (Don\'t apply Weakness and Resistance.) This power can\'t be used if ' +
        'Machamp is Asleep, Confused, or Paralyzed when your opponent attacks.'
    },
  ];

  public attacks = [
    {
      name: 'Seismic Toss',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: '60',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Machamp';

  public fullName: string = 'Machamp BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterDamageEffect && effect.target.pokemons.cards.includes(this)) {
      const player = effect.player;
      const target = effect.target;

      if (target.specialConditions.includes(SpecialCondition.ASLEEP)
        || target.specialConditions.includes(SpecialCondition.CONFUSED)
        || target.specialConditions.includes(SpecialCondition.PARALYZED)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const targetPlayer = StateUtils.findOwner(state, target);

      // No damage, or damage done by itself, or Carvanha is not active
      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== target) {
        return state;
      }

      // Pokemon is evolved, Not an attack
      if (target.getPokemonCard() !== this || state.phase !== GamePhase.ATTACK) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.source.damage += 10;
    }

    return state;
  }
}
