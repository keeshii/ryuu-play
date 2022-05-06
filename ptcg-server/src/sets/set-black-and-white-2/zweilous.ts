import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, CoinFlipPrompt, Card, ChooseCardsPrompt,
  EnergyCard } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

function* useWhirlpool(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {

  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Defending Pokemon has no energy cards attached
  if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
    return state;
  }

  let flipResult = false;
  yield store.prompt(state, new CoinFlipPrompt(
    player.id, GameMessage.COIN_FLIP
  ), result => {
    flipResult = result;
    next();
  });

  if (!flipResult) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    opponent.active,
    { superType: SuperType.ENERGY },
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  const discardEnergy = new DiscardCardsEffect(effect, cards);
  return store.reduceEffect(state, discardEnergy);
}


export class Zweilous extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Deino';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 80;

  public weakness = [{ type: CardType.DRAGON }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Crunch',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 30,
      text: 'Flip a coin. If heads, discard an Energy attached to ' +
        'the Defending Pokemon.'
    },
    {
      name: 'Dragon Claw',
      cost: [ CardType.PSYCHIC, CardType.DARK, CardType.DARK ],
      damage: 80,
      text: ''
    }
  ];

  public set: string = 'BW2';

  public name: string = 'Zweilous';

  public fullName: string = 'Zweilous DGE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useWhirlpool(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
