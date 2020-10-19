import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SpecialCondition, SuperType } from "../../game/store/card/card-types";
import { StoreLike, State, StateUtils, CoinFlipPrompt, ChooseCardsPrompt } from "../../game";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { Effect } from "../../game/store/effects/effect";
import { CardMessage } from "../card-message";
import { DiscardCardsEffect } from "../../game/store/effects/attack-effects";

export class Deino extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 60;

  public weakness = [{ type: CardType.DRAGON }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Deep Growl',
      cost: [ CardType.DARK ],
      damage: 0,
      text: 'Flip a coin. If heads, the Defending Pokemon is now Paralyzed.'
    },
    {
      name: 'Power Breath',
      cost: [ CardType.PSYCHIC, CardType.COLORLESS ],
      damage: 30,
      text: 'Discard an Energy attached to this Pokemon.'
    }
  ];

  public set: string = 'BW2';

  public name: string = 'Deino';

  public fullName: string = 'Deino DGE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, CardMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          opponent.active.addSpecialCondition(SpecialCondition.PARALYZED);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        CardMessage.CHOOSE_ENERGY_CARD,
        player.active,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        const discardEnergy = new DiscardCardsEffect(player, cards,
          effect.attack, player.active, player.active);
        return store.reduceEffect(state, discardEnergy);
      });
    }

    return state;
  }

}
