import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  ShuffleDeckPrompt,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class Abra extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Vanish',
      cost: [CardType.PSYCHIC],
      damage: '',
      text: 'Shuffle Abra into your deck. (Discard all cards attached to Abra.)'
    },
    {
      name: 'Psyshock',
      cost: [CardType.PSYCHIC],
      damage: '10',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Abra';

  public fullName: string = 'Abra TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipSpecialConditions = commonAttacks.flipSpecialConditions(this, store, state, effect);
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      player.active.pokemons.moveTo(player.deck);
      player.active.moveTo(player.discard);

      return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return flipSpecialConditions.use(effect, [SpecialCondition.PARALYZED]);
    }

    return state;
  }
}
