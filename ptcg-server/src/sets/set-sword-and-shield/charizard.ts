import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage, ChooseCardsPrompt,
  CardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class Charizard extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Charmeleon';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 170;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Battle Sense',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may look at the top 3 cards of your ' +
      'deck and put 1 of them into your hand. Discard the other cards.'
  }];

  public attacks = [
    {
      name: 'Royal Blaze',
      cost: [ CardType.FIRE, CardType.FIRE ],
      damage: 100,
      text: 'This attack does 50 more damage for each Leon card ' +
        'in your discard pile.'
    }
  ];

  public set: string = 'SSH';

  public name: string = 'Charizard';

  public fullName: string = 'Charizard VIV';

  public readonly BATTLE_SENSE_MARKER = 'BATTLE_SENSE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.BATTLE_SENSE_MARKER, this);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const cards = effect.player.discard.cards.filter(c => c.name === 'Leon');
      effect.damage += cards.length * 50;
      return state;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.BATTLE_SENSE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 3);

      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        deckTop,
        { },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        player.marker.addMarker(this.BATTLE_SENSE_MARKER, this);
        deckTop.moveCardsTo(selected, player.hand);
        deckTop.moveTo(player.discard);
      });
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.BATTLE_SENSE_MARKER, this);
    }

    return state;
  }

}
