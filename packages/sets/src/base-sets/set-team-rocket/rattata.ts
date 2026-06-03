import {
  AttackEffect,
  CardType,
  ChoosePrizePrompt,
  CoinFlipPrompt,
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

export class Rattata extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 40;

  public powers = [
    {
      name: 'Trickery',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may switch 1 of your Prizes with the top card of your ' +
        'deck. This power can\'t be used if Rattata is Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Quick Attack',
      cost: [CardType.COLORLESS],
      damage: '10+',
      text:
        'Flip a coin. If heads, this attack does 10 damage plus 10 more damage; if tails, this attack does 10 ' +
        'damage.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [];

  public set: string = 'TR';

  public name: string = 'Rattata';

  public fullName: string = 'Rattata TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const powerUseOnce = commonMarkers.powerUseOnce(this, store, state, effect);

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (pokemonSlot === undefined
        || pokemonSlot.specialConditions.includes(SpecialCondition.ASLEEP)
        || pokemonSlot.specialConditions.includes(SpecialCondition.CONFUSED)
        || pokemonSlot.specialConditions.includes(SpecialCondition.PARALYZED)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (powerUseOnce.hasMarker(effect)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      powerUseOnce.setMarker(effect);
      return store.prompt(
        state,
        new ChoosePrizePrompt(player.id, GameMessage.CHOOSE_PRIZE_CARD, {
          count: 1,
          allowCancel: false,
        }),
        prizes => {
          if (prizes && prizes.length > 0) {
            const temp = player.deck.cards[0];
            player.deck.cards[0] = prizes[0].cards[0];
            prizes[0].cards[0] = temp;
          }
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          effect.damage += 10;
        }
      });
    }

    return state;
  }
}
