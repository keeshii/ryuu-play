import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, CardTag, SuperType } from "../../game/store/card/card-types";
import { StoreLike, State, StateUtils, Card, EnergyCard, CoinFlipPrompt,
  ChooseCardsPrompt } from "../../game";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { DiscardCardsEffect } from "../../game/store/effects/attack-effects";
import { Effect } from "../../game/store/effects/effect";
import { GameMessage } from "../../game/game-message";

function* usePowerBlast(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  // Active Pokemon has no energy cards attached
  if (!player.active.cards.some(c => c instanceof EnergyCard)) {
    return state;
  }

  let flipResult = false;
  yield store.prompt(state, new CoinFlipPrompt(
    player.id, GameMessage.COIN_FLIP
  ), result => {
    flipResult = result;
    next();
  });

  if (flipResult) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    player.active,
    { superType: SuperType.ENERGY },
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  const discardEnergy = new DiscardCardsEffect(effect, cards);
  discardEnergy.target = player.active;
  return store.reduceEffect(state, discardEnergy);
}


export class TornadusEx extends PokemonCard {

  public tags = [ CardTag.POKEMON_EX ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 170;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Blow Through',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 30,
      text: 'If there is any Stadium card in play, this attack does 30 ' +
        'more damage.'
    }, {
      name: 'Power Blast',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 100,
      text: 'Flip a coin. If tails, discard an Energy attached to this Pokemon.'
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Tornadus EX';

  public fullName: string = 'Tornadus EX DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      if (StateUtils.getStadiumCard(state) !== undefined) {
        effect.damage += 30;
      }
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      let generator: IterableIterator<State>;
      generator = usePowerBlast(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
