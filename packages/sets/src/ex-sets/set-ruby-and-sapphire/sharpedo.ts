import {
  AfterDamageEffect,
  AttackEffect,
  Card,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseEnergyPrompt,
  DiscardCardsEffect,
  Effect,
  GameMessage,
  GamePhase,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Sharpedo extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Carvanha';

  public cardType: CardType = CardType.WATER;

  public hp: number = 70;

  public powers = [
    {
      name: 'Rough Skin',
      powerType: PowerType.POKEBODY,
      text:
        'If Sharpedo is your Active Pokémon and is damaged by an opponent\'s attack (even if Sharpedo is Knocked ' +
        'Out), put 2 damage counters on the Attacking Pokémon.',
    },
  ];

  public attacks = [
    {
      name: 'Dark Slash',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40+',
      text:
        'You may discard a D Energy card attached to Sharpedo. If you do, this attack does 40 damage plus 30 ' +
        'more damage.',
    },
  ];

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Sharpedo';

  public fullName: string = 'Sharpedo RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterDamageEffect && effect.target.cards.includes(this)) {
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

      effect.source.damage += 20;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(
        state,
        new ChooseEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          checkProvidedEnergy.energyMap,
          [CardType.DARK],
          { allowCancel: true }
        ),
        energy => {
          const cards: Card[] = (energy || []).map(e => e.card);
          if (cards.length > 0) {
            effect.damage += 30;
            const discardEnergy = new DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
          }
        }
      );
    }

    return state;
  }
}
