import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SuperType, EnergyType } from "../../game/store/card/card-types";
import { StoreLike, State, StateUtils, ChooseCardsPrompt } from "../../game";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { Effect } from "../../game/store/effects/effect";
import { GameMessage } from "../../game/game-message";

export class Pignite extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Tepig';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 100;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Flame Charge',
      cost: [ CardType.COLORLESS ],
      damage: 0,
      text: 'Search your deck for a R Energy card and attach it to this ' +
        'Pokemon. Shuffle your deck afterward.'
    },
    {
      name: 'Heat Crash',
      cost: [ CardType.FIRE, CardType.FIRE, CardType.COLORLESS ],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'BW';

  public name: string = 'Pignite';

  public fullName: string = 'Pignite BW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const cardList = StateUtils.findCardList(state, this);
      if (cardList === undefined) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_ATTACH,
        player.deck,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { min: 1, max: 1, allowCancel: true }
      ), cards => {
        cards = cards || [];
        if (cards.length > 0) {
          player.deck.moveCardsTo(cards, cardList);
        }
      });
    }

    return state;
  }

}
