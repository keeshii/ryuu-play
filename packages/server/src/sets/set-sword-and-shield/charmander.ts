import { PokemonCard } from '@ptcg/common';
import { Stage, CardType } from '@ptcg/common';
import { StoreLike, State } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import { Effect } from '@ptcg/common';


export class Charmander extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 70;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    { name: 'Collect', cost: [CardType.FIRE], damage: 0, text: 'Draw a card.' },
    { name: 'Flare', cost: [CardType.FIRE, CardType.FIRE], damage: 30, text: '' }
  ];

  public set: string = 'SSH';

  public name: string = 'Charmander';

  public fullName: string = 'Charmander VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      player.deck.moveTo(player.hand, 1);
      return state;
    }

    return state;
  }

}
