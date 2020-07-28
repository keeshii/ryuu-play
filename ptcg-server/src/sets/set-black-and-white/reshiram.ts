import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike, State, Card, ChooseEnergyPrompt} from "../../game";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { Effect } from "../../game/store/effects/effect";
import { CardMessage } from "../card-message";
import { CheckProvidedEnergyEffect } from "../../game/store/effects/check-effects";


export class Reshiram extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 130;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Outrage',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 20,
      text: 'Does 10 more damage for each damage counter on this Pokemon.'
    },
    {
      name: 'Blue Flare',
      cost: [ CardType.FIRE, CardType.FIRE, CardType.COLORLESS ],
      damage: 120,
      text: 'Discard 2 R Energy attached to this Pokemon.'
    }
  ];

  public set: string = 'BW';

  public name: string = 'Reshiram';

  public fullName: string = 'Reshiram BW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage += effect.source.damage;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        CardMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [ CardType.FIRE, CardType.FIRE ],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        effect.source.moveCardsTo(cards, player.discard);
      });
    }

    return state;
  }

}
