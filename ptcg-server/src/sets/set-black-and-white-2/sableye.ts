import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SpecialCondition, TrainerType, SuperType } from "../../game/store/card/card-types";
import { StoreLike, State, CoinFlipPrompt, TrainerCard, ChooseCardsPrompt } from "../../game";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { Effect } from "../../game/store/effects/effect";
import { AddSpecialConditionsEffect } from "../../game/store/effects/attack-effects";
import { GameMessage } from "../../game/game-message";

export class Sableye extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 70;

  public weakness = [ ];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Confuse Ray',
      cost: [ CardType.COLORLESS ],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokemon is now Confused.'
    },
    {
      name: 'Junk Hunt',
      cost: [ CardType.DARK ],
      damage: 0,
      text: 'Put 2 Item cards from your discard pile into your hand.'
    }
  ];

  public set: string = 'BW2';

  public name: string = 'Sableye';

  public fullName: string = 'Sableye DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const addSpecialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
          store.reduceEffect(state, addSpecialCondition);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const itemCount = player.discard.cards.filter(c => {
        return c instanceof TrainerCard && c.trainerType === TrainerType.ITEM;
      }).length;

      if (itemCount === 0) {
        return state;
      }

      const max = Math.min(2, itemCount);
      const min = max;

      return store.prompt(state, [
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_ANY_TWO_CARDS,
          player.discard,
          { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
          { min, max, allowCancel: false }
      )], selected => {
        const cards = selected || [];
        player.discard.moveCardsTo(cards, player.hand);
      });
    }

    return state;
  }

}
