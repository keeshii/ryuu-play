import {
  Attack,
  AttackEffect,
  CardType,
  CheckProvidedEnergyEffect,
  CoinFlipPrompt,
  DealDamageEffect,
  Effect,
  GameError,
  GameMessage,
  GamePhase,
  KnockOutEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class DarkGyarados extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Magikarp';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 70;

  public powers = [
    {
      name: 'Final Beam',
      powerType: PowerType.POKEPOWER,
      text:
        'When Dark Gyarados is Knocked Out by an attack, flip a coin. If heads, this power does 20 damage for each ' +
        'W Energy attached to Dark Gyarados to the Pokémon that Knocked Out Dark Gyarados. Apply Weakness and ' +
        'Resistance. This power doesn\'t work if Dark Gyarados is Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Ice Beam',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER],
      damage: '30',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Gyarados';

  public fullName: string = 'Dark Gyarados TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipSpecialConditions = commonAttacks.flipSpecialConditions(this, store, state, effect);

    if (effect instanceof KnockOutEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const active = effect.target;

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      if (active === undefined
        || active.specialConditions.includes(SpecialCondition.ASLEEP)
        || active.specialConditions.includes(SpecialCondition.CONFUSED)
        || active.specialConditions.includes(SpecialCondition.PARALYZED)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);
      const waterEnergy = checkProvidedEnergy.energyMap.reduce(
        (left, p) => left + p.provides.filter(p => p === CardType.WATER || p === CardType.ANY).length, 0);
      const damage = 20 * waterEnergy;

      if (damage === 0) {
        return state;
      }

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const attack: Attack = {
            name: this.powers[0].name,
            cost: [],
            damage: '',
            text: this.powers[0].text,
          };
          const attackEffect = new AttackEffect(player, opponent, attack);
          const dealDamageEffect = new DealDamageEffect(attackEffect, damage);
          store.reduceEffect(state, dealDamageEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return flipSpecialConditions.use(effect, [SpecialCondition.PARALYZED]);
    }

    return state;
  }
}
