import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage, CoinFlipPrompt } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import {AddSpecialConditionsEffect} from '../../game/store/effects/attack-effects';


export class Snorlax extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 130;

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public weakness = [{ type: CardType.FIGHTING }];

  public powers = [{
    name: 'Gormandize',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokemon is in the Active Spot, ' +
      'you may draw cards until you have 7 cards in your hand. ' +
      'If you use this Ability, your turn ends.'
  }];

  public attacks = [
    {
      name: 'Body Slam',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 100,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokemon is now Paralyzed.'
    }
  ];

  public set: string = 'SSH';

  public name: string = 'Snorlax';

  public fullName: string = 'Snorlax VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Gormandize
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      // Snorlax is not active Pokemon
      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const count = Math.max(0, 7 - player.hand.cards.length);
      if (count === 0 || player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.deck.moveTo(player.hand, count);
      const endTurnEffect = new EndTurnEffect(player);
      store.reduceEffect(state, endTurnEffect);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    return state;
  }

}
