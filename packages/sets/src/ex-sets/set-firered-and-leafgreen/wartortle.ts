import {
  AttackEffect,
  CardType,
  ChoosePokemonPrompt,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  SlotType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Wartortle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Squirtle';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Water Gun',
      cost: [CardType.WATER],
      damage: '20+',
      text:
        'Does 20 damage plus 10 more damage for each W Energy attached to Wartortle but not used to pay for this ' +
        'attack\'s Energy cost. You can\'t add more than 20 damage in this way.'
    },
    {
      name: 'Smash Turn',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: 'After your attack, you may switch Wartortle with 1 of your Benched Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Wartortle';

  public fullName: string = 'Wartortle RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const hasBenched = player.bench.some(b => b.pokemons.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: true }
        ),
        selected => {
          if (!selected || selected.length === 0) {
            return state;
          }
          const target = selected[0];
          player.switchPokemon(target);
        }
      );
    }

    return state;
  }
}
