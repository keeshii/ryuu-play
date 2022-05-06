import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Oranguru extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 120;

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public weakness = [{ type: CardType.FIGHTING }];

  public powers = [{
    name: 'Primate Wisdom',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may switch a card from your hand ' +
      'with the top card of your deck.'
  }];

  public attacks = [
    {
      name: 'Whap Down',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'SSH';

  public name: string = 'Oranguru';

  public fullName: string = 'Oranguru SSH';

  public readonly PRIMATE_WISDOM_MARKER = 'PRIMATE_WISDOM_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.PRIMATE_WISDOM_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.deck.cards.length === 0 || player.hand.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.PRIMATE_WISDOM_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_DECK,
        player.hand,
        { },
        { min: 1, max: 1, allowCancel: true }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          player.deck.moveTo(player.hand, 1);
          const index = player.hand.cards.indexOf(cards[0]);
          if (index !== -1) {
            player.hand.cards.splice(index, 1);
            player.deck.cards.unshift(cards[0]);
          }
          player.marker.addMarker(this.PRIMATE_WISDOM_MARKER, this);
        }
      });
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.PRIMATE_WISDOM_MARKER, this);
    }

    return state;
  }

}
