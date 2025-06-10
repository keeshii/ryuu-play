import {
  AttachEnergyEffect,
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Marshtomp2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Mudkip';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 80;

  public powers = [
    {
      name: 'Natural Cure',
      powerType: PowerType.POKEBODY,
      text:
        'When you attach a W Energy card from your hand to Marshtomp, remove all Special Conditions from ' +
        'Marshtomp.',
    },
  ];

  public attacks = [
    {
      name: 'Aqua Sonic',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: 'This attack\'s damage is not affected by Resistance.',
    },
  ];

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Marshtomp';

  public fullName: string = 'Marshtomp RS-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttachEnergyEffect && effect.target.pokemons.cards.includes(this)) {
      const player = effect.player;
      const pokemonCard = effect.target.getPokemonCard();

      if (!effect.energyCard.provides.includes(CardType.WATER)) {
        return state;
      }

      // pokemon is evolved
      if (pokemonCard !== this) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      const conditions = effect.target.specialConditions.slice();
      conditions.forEach(condition => {
        effect.target.removeSpecialCondition(condition);
      });
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.ignoreResistance = true;
    }

    return state;
  }
}
