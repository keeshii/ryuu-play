import { Effect } from "../../game/store/effects/effect";
import { PokemonCard } from "../../game/store/card/pokemon-card";
import { PowerType, StoreLike, State, CoinFlipPrompt,
  ChooseCardsPrompt} from "../../game";
import { Stage, CardType, SpecialCondition } from "../../game/store/card/card-types";
import { PlayPokemonEffect } from "../../game/store/effects/play-card-effects";
import { CardMessage } from "../card-message";
import { AttackEffect, PowerEffect } from "../../game/store/effects/game-effects";
import { AddSpecialConditionsEffect } from "../../game/store/effects/attack-effects";


export class Roserade extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  evolvesFrom = 'Roselia';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.WATER, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Le Parfum',
    powerType: PowerType.POKEPOWER,
    text: 'When you play this Pokemon from your hand to evolve 1 of your ' +
      'Pokemon, you may search your deck for any card and put it into your ' +
      'hand. Shuffle your deck afterward.'
  }];

  public attacks = [
    {
      name: 'Squeeze',
      cost: [ CardType.GRASS, CardType.COLORLESS ],
      damage: 30,
      text: 'Flip a coin. If heads, this attack does 20 more damage and ' +
        'the Defending Pokemon is now Paralyzed.'
    }
  ];

  public set: string = 'BW2';

  public name: string = 'Roserade';

  public fullName: string = 'Roserade DGE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        CardMessage.CHOOSE_ANY_CARD,
        player.deck,
        { },
        { min: 1, max: 1, allowCancel: true }
      ), selected => {
        const cards = selected || [];
        player.deck.moveCardsTo(cards, player.hand);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, CardMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const addSpecialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          effect.damage += 20;
          store.reduceEffect(state, addSpecialCondition);
        }
      });
    }

    return state;
  }

}
