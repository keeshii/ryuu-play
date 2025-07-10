import {
  AfterDamageEffect,
  AttackEffect,
  CardType,
  ChoosePokemonPrompt,
  Effect,
  GameMessage,
  GamePhase,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  SlotType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Cacturne extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Cacnea';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 80;

  public powers = [
    {
      name: 'Poison Payback',
      powerType: PowerType.POKEBODY,
      text:
        'If Cacturne is your Active Pokémon and is damaged by an opponent\'s attack (even if Cacturne is Knocked ' +
        'Out), the Attacking Pokémon is now Poisoned.'
    },
  ];

  public attacks = [
    {
      name: 'Feint Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Choose 1 of your opponent\'s Pokémon. This attack does 40 damage to that Pokémon. This attack\'s damage ' +
        'isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies or any other effects on that Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Cacturne';

  public fullName: string = 'Cacturne SS';

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
      player.active.addSpecialCondition(SpecialCondition.POISONED);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false }
        ),
        targets => {
          if (!targets || targets.length === 0) {
            return;
          }
          targets[0].damage += 40;
          const afterDamage = new AfterDamageEffect(effect, 40);
          afterDamage.target = targets[0];
          state = store.reduceEffect(state, afterDamage);
        }
      );
    }

    return state;
  }
}
