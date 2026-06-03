import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  ShuffleDeckPrompt,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class DarkMachamp extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Dark Machoke';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Mega Punch',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: '30',
      text: ''
    },
    {
      name: 'Fling',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: '',
      text:
        'Your opponent shuffles his or her Active Pokémon and all cards attached to it into his or her deck. This ' +
        'attack can\'t be used if your opponent has no Benched Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Machamp';

  public fullName: string = 'Dark Machamp TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.pokemons.cards.length > 0);

      if (!hasBench) {
        return state;
      }

      opponent.active.moveTo(opponent.deck);
      return store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
        opponent.deck.applyOrder(order);
      });
    }

    return state;
  }
}
