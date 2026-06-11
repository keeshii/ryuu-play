import {
  AttackEffect,
  Card,
  CardList,
  CardTag,
  CardType,
  DiscardCardsEffect,
  Effect,
  EnergyCard,
  EnergyType,
  FilterUtils,
  GameMessage,
  PokemonCard,
  SelectPrompt,
  Stage,
  State,
  StoreLike,
  SuperType
} from '@ptcg/common';

export class RayquazaEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.DRAGON];

  public hp: number = 170;

  public weakness = [{ type: CardType.DRAGON }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Celestial Roar',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Discard the top 3 cards of your deck. If any of those cards ' +
        'are Energy cards, attach them to this Pokémon.',
    },
    {
      name: 'Dragon Burst',
      cost: [CardType.FIRE, CardType.LIGHTNING],
      damage: '60×',
      text:
        'Discard all basic R Energy or all basic L Energy attached to ' +
        'this Pokémon. This attack does 60 damage times the number of Energy ' +
        'cards you discarded.',
    },
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
      temp.moveCardsTo(energyCards, player.active.energies);
      temp.moveTo(player.discard);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(
        state,
        new SelectPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          [GameMessage.TYPE_FIRE, GameMessage.TYPE_LIGHTNING],
          { allowCancel: false }
        ),
        choice => {
          const cardType = choice === 0 ? CardType.FIRE : CardType.LIGHTNING;
          const cards: Card[] = FilterUtils.filter(
            player.active.energies.cards,
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, provides: [cardType] }
          );

          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);
          effect.damage = 60 * cards.length;
        }
      );
    }

    return state;
  }
}
