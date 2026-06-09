import {
  AttackEffect,
  CardType,
  ChooseCardsPrompt,
  Effect,
  GameError,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';
import { commonMarkers } from '../../common';

export class DarkKadabra extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Abra';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 50;

  public powers = [
    {
      name: 'Matter Exchange',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'Once during your turn (before your attack), you may discard a card from your hand in order to draw a card. ' +
        'This power can\'t be used if Dark Kadabra is Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Mind Shock',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: '30',
      text:
        'Don\'t apply Weakness and Resistance for this attack. (Any other effects that would happen after applying ' +
        'Weakness and Resistance still happen.)'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Kadabra';

  public fullName: string = 'Dark Kadabra TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const powerUseOnce = commonMarkers.powerUseOnce(this, store, state, effect);
    
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (player.hand.cards.length === 0 || player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (pokemonSlot === undefined
        || pokemonSlot.specialConditions.includes(SpecialCondition.ASLEEP)
        || pokemonSlot.specialConditions.includes(SpecialCondition.CONFUSED)
        || pokemonSlot.specialConditions.includes(SpecialCondition.PARALYZED)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (powerUseOnce.hasMarker(effect)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.hand,
          { },
          { min: 1, max: 1, allowCancel: true }
        ),
        selected => {
          const cards = selected || [];
          if (cards.length > 0) {
            powerUseOnce.setMarker(effect);
            player.hand.moveCardsTo(cards, player.discard);
            player.deck.moveTo(player.hand, 1);
          }
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;
      return state;
    }

    return state;
  }
}
