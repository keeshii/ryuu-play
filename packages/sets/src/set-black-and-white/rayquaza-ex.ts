import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, CardTag } from '@ptcg/common';
import { StoreLike, State, CardList, EnergyCard, Card } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { CheckProvidedEnergyEffect } from '@ptcg/common';
import { SelectPrompt } from '@ptcg/common';
import { DiscardCardsEffect } from '@ptcg/common';


export class RayquazaEx extends PokemonCard {

  public tags = [ CardTag.POKEMON_EX ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 170;

  public weakness = [{ type: CardType.DRAGON }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Celestial Roar',
      cost: [ CardType.COLORLESS ],
      damage: '',
      text: 'Discard the top 3 cards of your deck. If any of those cards ' +
        'are Energy cards, attach them to this Pokemon.'
    },
    {
      name: 'Dragon Burst',
      cost: [CardType.FIRE, CardType.LIGHTNING ],
      damage: '60×',
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
      temp.moveCardsTo(energyCards, player.active);
      temp.moveTo(player.discard);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        [ GameMessage.ALL_FIRE_ENERGIES, GameMessage.ALL_LIGHTNING_ENERGIES ],
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

        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
        effect.damage = damage;
      });
    }

    return state;
  }

}
