import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike, State, Card, ChooseEnergyPrompt} from "../../game";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { Effect } from "../../game/store/effects/effect";
import { CardMessage } from "../card-message";
import { CheckProvidedEnergyEffect } from "../../game/store/effects/check-effects";
import { DiscardCardsEffect } from "../../game/store/effects/attack-effects";


export class Hydreigon extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Zweilous'

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 150;

  public weakness = [{ type: CardType.DRAGON }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [{
      name: 'Dragonblast',
      cost: [ CardType.PSYCHIC, CardType.DARK, CardType.DARK, CardType.COLORLESS ],
      damage: 120,
      text: 'Discard 2 D Energy attached to this Pokemon.'
  }];

  public set: string = 'BW2';

  public name: string = 'Hydreigon';

  public fullName: string = 'Hydreigon DGE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        CardMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [ CardType.DARK, CardType.DARK ],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);

        const discardEnergy = new DiscardCardsEffect(player, cards,
          effect.attack, player.active, player.active);
        return store.reduceEffect(state, discardEnergy);
      });
    }

    return state;
  }

}
