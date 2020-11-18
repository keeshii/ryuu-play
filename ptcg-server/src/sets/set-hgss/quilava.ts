import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike, State, ChooseEnergyPrompt, Card } from "../../game";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { Effect } from "../../game/store/effects/effect";
import { GameMessage } from "../../game/game-message";
import { CheckProvidedEnergyEffect } from "../../game/store/effects/check-effects";


export class Quilava extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Cyndaquil';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 80;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Flare',
      cost: [ CardType.FIRE, CardType.COLORLESS ],
      damage: 30,
      text: ''
    },
    {
      name: 'Flamethrower',
      cost: [ CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 60,
      text: 'Discard an Energy attached to Quilava.'
    }
  ];

  public set: string = 'HGSS';

  public name: string = 'Quilava';

  public fullName: string = 'Quilava HGSS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      return store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [ CardType.COLORLESS ],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        effect.player.active.moveCardsTo(cards, player.discard);
      });
    }

    return state;
  }

}
