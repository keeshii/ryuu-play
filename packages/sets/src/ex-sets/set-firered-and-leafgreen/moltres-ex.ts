import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardTag,
  CardType,
  ChooseCardsPrompt,
  DiscardCardsEffect,
  Effect,
  GameMessage,
  PokemonCard,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonPowers } from '../../common';

export class MoltresEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 110;

  public powers = [
    {
      name: 'Legendary Ascent',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn, when you put Moltres ex from your hand onto your Bench, you may switch 1 of your ' +
        'Active Pokémon with Moltres ex. If you do, you may also move any number of basic R Energy cards attached ' +
        'to your Pokémon to Moltres ex.'
    },
  ];

  public attacks = [
    {
      name: 'Crushing Flames',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
      damage: '60',
      text: 'You may discard an Energy card attached to Moltres ex. If you do, the Defending Pokémon is now Confused.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Moltres ex';

  public fullName: string = 'Moltres ex RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const legendaryAscent = commonPowers.legendaryAscent(this, store, state, effect);

    legendaryAscent.reduce(this.powers[0], CardType.FIRE);

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
            // Apply special condition
            const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
            store.reduceEffect(state, specialConditionEffect);
          }
        }
      );
    }

    return state;
  }
}
