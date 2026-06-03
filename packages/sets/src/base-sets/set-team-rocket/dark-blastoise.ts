import {
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  DealDamageEffect,
  Effect,
  GameMessage,
  PokemonCard,
  PutDamageEffect,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks, commonMarkers } from '../../common';

export class DarkBlastoise extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Dark Wartortle';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Hydrocannon',
      cost: [CardType.WATER, CardType.WATER],
      damage: '30+',
      text:
        'Does 30 damage plus 20 more damage for each W Energy attached to Dark Blastoise but not used to pay for ' +
        'this attack. You can\'t add more than 40 damage in this way.'
    },
    {
      name: 'Rocket Tackle',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text:
        'Dark Blastoise does 10 damage to itself. Flip a coin. If heads, prevent all damage done to Dark Blastoise ' +
        'during your opponent\'s next turn. (Any other effects of attacks still happen.)'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Blastoise';

  public fullName: string = 'Dark Blastoise TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const additionalEnergyDamage = commonAttacks.additionalEnergyDamage(this, store, state, effect);
    const opponentNextTurn = commonMarkers.duringOpponentNextTurn(this, store, state, effect);

    if (effect instanceof PutDamageEffect && opponentNextTurn.hasMarker(effect, effect.target)) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return additionalEnergyDamage.use(effect, CardType.WATER, 20, 2);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 10);
      dealDamage.target = player.active;
      store.reduceEffect(state, dealDamage);

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          opponentNextTurn.setMarker(effect, effect.player.active);
        }
      });
    }

    return state;
  }
}
