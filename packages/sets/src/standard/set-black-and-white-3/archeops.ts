import {
  AttackEffect,
  CardType,
  ChoosePokemonPrompt,
  Effect,
  EvolveEffect,
  GameError,
  GameMessage,
  PlayerType,
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

export class Archeops extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Archen';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 130;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Ancient Power',
      powerType: PowerType.ABILITY,
      text: 'Each player can\'t play any Pokémon from his or her hand to evolve his or her Pokémon.',
    },
  ];

  public attacks = [
    {
      name: 'Rock Slide',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: '60',
      text:
        'Does 10 damage to 2 of your opponent\'s Benched Pokémon. ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokémon.)',
    },
  ];

  public set: string = 'BW3';

  public name: string = 'Archeops';

  public fullName: string = 'Archeops NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const benched = opponent.bench.reduce((left, b) => left + (b.pokemons.cards.length ? 1 : 0), 0);
      if (benched === 0) {
        return state;
      }
      const count = Math.min(2, benched);

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { min: count, max: count, allowCancel: false }
        ),
        targets => {
          if (!targets || targets.length === 0) {
            return;
          }
          targets.forEach(target => {
            const damageEffect = new PutDamageEffect(effect, 10);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          });
        }
      );
    }

    if (effect instanceof EvolveEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isArcheopsInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, card) => {
        if (card === this) {
          isArcheopsInPlay = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (pokemonSlot, card) => {
        if (card === this) {
          isArcheopsInPlay = true;
        }
      });

      if (!isArcheopsInPlay) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    return state;
  }
}
