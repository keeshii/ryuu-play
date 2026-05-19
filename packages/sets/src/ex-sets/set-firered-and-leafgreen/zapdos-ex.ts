import {
  AttackEffect,
  CardTag,
  CardType,
  ChooseCardsPrompt,
  DiscardCardsEffect,
  Effect,
  GameMessage,
  PokemonCard,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonPowers } from '../../common';

export class ZapdosEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 110;

  public powers = [
    {
      name: 'Legendary Ascent',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn, when you put Zapdos ex from your hand onto your Bench, you may switch 1 of your ' +
        'Active Pokémon with Zapdos ex. If you do, you may also move any number of basic L Energy cards attached to ' +
        'your Pokémon to Zapdos ex.'
    },
  ];

  public attacks = [
    {
      name: 'Electron Crush',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: '50+',
      text:
        'You may discard an Energy card attached to Zapdos ex. If you do, this attack does 50 damage plus 20 more ' +
        'damage.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Zapdos ex';

  public fullName: string = 'Zapdos ex RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const legendaryAscent = commonPowers.legendaryAscent(this, store, state, effect);

    legendaryAscent.reduce(this.powers[0], CardType.LIGHTNING);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      // Active Pokemon has no energy card to discard
      if (player.active.energies.cards.length === 0) {
        return state;
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          player.active.energies,
          {},
          { min: 1, max: 1, allowCancel: true }
        ),
        selected => {
          const cards = selected || [];
          if (cards.length > 0) {
            // Discard selected card
            const discardEnergy = new DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
            // 20 more damage if energy card discarded
            effect.damage += 20;
          }
        }
      );
    }

    return state;
  }
}
