import {
  AttackEffect,
  CardType,
  ChoosePokemonPrompt,
  Effect,
  GameMessage,
  PlayerType,
  PlayPokemonEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Crobat extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Golbat';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 130;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [];

  public powers = [
    {
      name: 'Surprise Bite',
      powerType: PowerType.ABILITY,
      text:
        'When you play this Pokémon from your hand to evolve 1 of your ' +
        'Pokémon, you may put 3 damage counters on 1 of your opponent\'s Pokémon.',
    },
  ];

  public attacks = [
    {
      name: 'Skill Dive',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'This attack does 30 damage to 1 of your opponent\'s Pokémon. ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokémon.)',
    },
  ];

  public set: string = 'BW4';

  public name: string = 'Crobat';

  public fullName: string = 'Crobat PFO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = StateUtils.findOwner(state, effect.target);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: true }
        ),
        selected => {
          const targets = selected || [];
          targets.forEach(target => {
            target.damage += 30;
          });
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false }
        ),
        selected => {
          const targets = selected || [];
          if (targets.includes(opponent.active)) {
            effect.damage = 30;
            return;
          }
          targets.forEach(target => {
            const damageEffect = new PutDamageEffect(effect, 30);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          });
        }
      );
    }

    return state;
  }
}
