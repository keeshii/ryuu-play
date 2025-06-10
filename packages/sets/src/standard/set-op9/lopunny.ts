import {
  AttackEffect,
  CardType,
  ChoosePokemonPrompt,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  PutDamageEffect,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Lopunny extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Buneary';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 80;

  public weakness = [
    {
      type: CardType.FIGHTING,
      value: 20,
    },
  ];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Jump Kick',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text:
        'Does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t ' +
        'apply Weakness and Resistance for Benched Pokémon.)',
    },
    {
      name: 'Jazzed',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: 'If Lopunny evolved from Buneary during this turn, remove all damage counters from Lopunny.',
    },
  ];

  public set: string = 'OP9';

  public name: string = 'Lopunny';

  public fullName: string = 'Lopunny OP9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBench = opponent.bench.some(b => b.pokemons.cards.length > 0);
      if (!hasBench) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ),
        targets => {
          targets.forEach(target => {
            const dealDamage = new PutDamageEffect(effect, 20);
            dealDamage.target = target;
            return store.reduceEffect(state, dealDamage);
          });
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      if (player.active.pokemonPlayedTurn === state.turn) {
        player.active.damage = 0;
      }
    }

    return state;
  }
}
