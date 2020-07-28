import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike, State, CardList, EnergyCard, Card, StateUtils} from "../../game";
import { AttackEffect, KnockOutEffect, DealDamageEffect } from "../../game/store/effects/game-effects";
import { Effect } from "../../game/store/effects/effect";
import { CardMessage } from "../card-message";
import { CheckProvidedEnergyEffect } from "../../game/store/effects/check-effects";
import { SelectPrompt } from "../../game/store/prompts/select-prompt";


export class RayquazaEx extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 170;

  public weakness = [{ type: CardType.DRAGON }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Celestial Roar',
      cost: [ CardType.COLORLESS ],
      damage: 0,
      text: 'Discard the top 3 cards of your deck. If any of those cards ' +
        'are Energy cards, attach them to this Pokemon.'
    },
    {
      name: 'Dragon Burst',
      cost: [CardType.FIRE, CardType.LIGHTNING ],
      damage: 60,
      text: 'Discard all basic R Energy or all basic L Energy attached to ' +
        'this Pokemon. This attack does 60 damage times the number of Energy ' +
        'cards you discarded.'
    }
  ];

  public set: string = 'BW';

  public name: string = 'Rayquaza EX';

  public fullName: string = 'Rayquaza EX DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const temp = new CardList();
      player.deck.moveTo(temp, 3);
      const energyCards = temp.cards.filter(c => c instanceof EnergyCard);
      temp.moveCardsTo(energyCards, effect.source);
      temp.moveTo(player.discard);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      effect.damage = 0;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      return store.prompt(state, new SelectPrompt(
        player.id,
        CardMessage.CHOOSE_ENERGIES_TO_DISCARD,
        [ CardMessage.ALL_FIRE_ENERGIES, CardMessage.ALL_LIGHTNING_ENERGIES ],
        { allowCancel: false }
      ), choice => {
        const cardType = choice === 0 ? CardType.FIRE : CardType.LIGHTNING;
        let damage = 0;

        const cards: Card[] = [];
        for (const energyMap of checkProvidedEnergy.energyMap) {
          const energy = energyMap.provides.filter(t => t === cardType || t === CardType.ANY);
          if (energy.length > 0) {
            cards.push(energyMap.card);
            damage += 60 * energy.length;
          }
        }

        player.active.moveCardsTo(cards, player.discard);

        const dealDamage = new DealDamageEffect(player, damage, this.attacks[1],
          opponent.active, effect.source);
        store.reduceEffect(state, dealDamage);
      });
    }

    // Pokemon ex rule
    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      effect.prizeCount += 1;
    }

    return state;
  }

}
