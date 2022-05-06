import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';


export class Charmeleon extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Charmander';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 90;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Slash',
      cost: [ CardType.FIRE ],
      damage: 20,
      text: ''
    },
    {
      name: 'Raging Flames',
      cost: [ CardType.FIRE, CardType.FIRE ],
      damage: 60,
      text: 'Discard the top 3 cards of your deck.'
    }
  ];

  public set: string = 'SSH';

  public name: string = 'Charmeleon';

  public fullName: string = 'Charmeleon VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      player.deck.moveTo(player.discard, 3);
      return state;
    }

    return state;
  }

}
