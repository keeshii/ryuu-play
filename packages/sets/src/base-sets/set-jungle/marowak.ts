import {
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';


export class Marowak extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Cubone';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Bonemerang',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: '30×',
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
    },
    {
      name: 'Call for Friend',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for a F Basic Pokémon card and put it onto your Bench. Shuffle your deck afterward. (You ' +
        'can\'t use this attack if your Bench is full.)'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public resistance = [
    { type: CardType.LIGHTNING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Marowak';

  public fullName: string = 'Marowak JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    const callForFamily = commonAttacks.callForFamily(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(
        state,
        [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)],
        results => {
          let heads: number = 0;
          results.forEach(r => {
            heads += r ? 1 : 0;
          });
          effect.damage = 30 * heads;
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return callForFamily.use(effect, { cardTypes: [CardType.FIGHTING] });
    }

    return state;
  }
}
