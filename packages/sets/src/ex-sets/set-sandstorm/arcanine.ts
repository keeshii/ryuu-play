import {
  AfterDamageEffect,
  AttackEffect,
  Card,
  CardType,
  CheckProvidedEnergyEffect,
  CoinFlipPrompt,
  DiscardCardsEffect,
  Effect,
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

export class Arcanine extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Growlithe';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 80;

  public powers = [
    {
      name: 'Fire Veil',
      powerType: PowerType.POKEBODY,
      text:
        'If Arcanine is your Active Pokémon and is damaged by an opponent\'s attack (even if Arcanine is Knocked ' +
        'Out), the Attacking Pokémon is now Burned.'
    },
  ];

  public attacks = [
    {
      name: 'Burn Up',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: '60',
      text: 'Flip a coin. If tails, discard all R Energy cards attached to Arcanine.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Arcanine';

  public fullName: string = 'Arcanine SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterDamageEffect && effect.target.pokemons.cards.includes(this)) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      // No damage, or damage done by itself, or Carvanha is not active
      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
        return state;
      }

      // Pokemon is evolved, Not an attack
      if (effect.target.getPokemonCard() !== this || state.phase !== GamePhase.ATTACK) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      // Add condition to the Attacking Pokemon
      player.active.addSpecialCondition(SpecialCondition.BURNED);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === false) {
          const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
          state = store.reduceEffect(state, checkProvidedEnergy);

          const cards: Card[] = [];
          checkProvidedEnergy.energyMap.forEach(em => {
            if (em.provides.includes(CardType.FIRE) || em.provides.includes(CardType.ANY)) {
              cards.push(em.card);
            }
          });

          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);
        }
      });
    }

    return state;
  }
}
