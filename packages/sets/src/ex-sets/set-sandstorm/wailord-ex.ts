import {
  AttackEffect,
  CardTag,
  CardType,
  ChoosePokemonPrompt,
  Effect,
  GameMessage,
  HealTargetEffect,
  PlayerType,
  PokemonCard,
  SlotType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class WailordEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Wailmer';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 200;

  public attacks = [
    {
      name: 'Super Deep Dive',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'If you don\'t have any Benched Pokémon, this attack does nothing. Remove 3 damage counters from Wailord ex. ' +
        'Switch Wailord ex with 1 of your Benched Pokémon.'
    },
    {
      name: 'Dwindling Wave',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: '100-',
      text: 'Does 100 damage minus 10 damage for each damage counter on Wailord ex.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS },
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Wailord ex';

  public fullName: string = 'Wailord ex SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
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
          { allowCancel: false }
        ),
        selected => {
          if (!selected || selected.length === 0) {
            return state;
          }
          const healEffect = new HealTargetEffect(effect, 30);
          healEffect.target = player.active;
          store.reduceEffect(state, healEffect);

          const target = selected[0];
          player.switchPokemon(target);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      effect.damage = Math.max(0, effect.damage - effect.player.active.damage);
      return state;
    }

    return state;
  }
}
