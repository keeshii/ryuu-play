import { PokemonCard } from '@ptcg/common';
import { Stage, CardType } from '@ptcg/common';
import { StoreLike, State, ShowCardsPrompt, StateUtils, PowerType, GameError,
  GameMessage, PokemonCardList, PlayerType, TrainerCard } from '@ptcg/common';
import { AttackEffect, PowerEffect } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { EndTurnEffect } from '@ptcg/common';
import { CheckPokemonTypeEffect } from '@ptcg/common';


export class Rotom extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 70;

  public weakness = [{ type: CardType.DARK, value: 20 }];

  public resistance = [{ type: CardType.COLORLESS, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Type Shift',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may use this ' +
      'power. Rotom\'s type is P until the end of your turn.'
  }];

  public attacks = [
    {
      name: 'Poltergeist',
      cost: [ CardType.PSYCHIC, CardType.COLORLESS ],
      damage: 30,
      text: 'Look at your opponent\'s hand. This attack does 30 damage plus ' +
        '10 more damage for each Trainer, Supporter, and Stadium card in ' +
        'your opponent\'s hand.'
    }
  ];

  public set: string = 'OP9';

  public name: string = 'Rotom';

  public fullName: string = 'Rotom OP9';

  public readonly TYPE_SHIFT_MARKER = 'TYPE_SHIFT_MARKER';

  public readonly CLEAR_TYPE_SHIFT_MARKER = 'CLEAR_TYPE_SHIFT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      if (!(cardList instanceof PokemonCardList)) {
        return state;
      }
      if (cardList.marker.hasMarker(this.TYPE_SHIFT_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      player.marker.addMarker(this.CLEAR_TYPE_SHIFT_MARKER, this);
      cardList.marker.addMarker(this.TYPE_SHIFT_MARKER, this);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.hand.cards.length === 0) {
        return state;
      }
      return store.prompt(state, new ShowCardsPrompt(
        player.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        opponent.hand.cards
      ), () => {
        const trainers = opponent.hand.cards.filter(c => c instanceof TrainerCard);
        effect.damage += 10 * trainers.length;
      });
    }

    if (effect instanceof CheckPokemonTypeEffect && effect.target.marker.hasMarker(this.TYPE_SHIFT_MARKER, this)) {
      effect.cardTypes = [ CardType.PSYCHIC ];
      return state;
    }

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_TYPE_SHIFT_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.CLEAR_TYPE_SHIFT_MARKER, this);
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.TYPE_SHIFT_MARKER, this);
      });
    }

    return state;
  }

}
