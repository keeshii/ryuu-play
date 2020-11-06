import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { PowerType, StoreLike, State, StateUtils, PokemonCardList, GameError,
  GameMessage, ChoosePrizePrompt, ChoosePokemonPrompt, PlayerType, SlotType,
  EnergyCard } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { PlayPokemonEffect } from "../../game/store/effects/play-card-effects";
import { PowerEffect, AttackEffect } from "../../game/store/effects/game-effects";
import { EndTurnEffect } from "../../game/store/effects/game-phase-effects";
import { PutDamageEffect } from "../../game/store/effects/attack-effects";

export class Rotom extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 60;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.COLORLESS, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Mischievous Trick',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may switch 1 of ' +
      'your face-down Prize cards with the top card of your deck. ' +
      'This power can\'t be used if Rotom is affected by a Special Condition.'
  }];

  public attacks = [
    {
      name: 'Plasma Arrow',
      cost: [ CardType.LIGHTNING ],
      damage: 0,
      text: 'Choose 1 of your opponent\'s Pokemon. This attack does 20 ' +
        'damage for each Energy attached to that Pokemon. This attack\'s ' +
        'damage isn\'t affected by Weakness or Resistance.'
    }
  ];

  public set: string = 'HGSS';

  public name: string = 'Rotom';

  public fullName: string = 'Rotom UND';

  public readonly MISCHIEVOUS_TRICK_MAREKER = 'MISCHIEVOUS_TRICK_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.MISCHIEVOUS_TRICK_MAREKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList | undefined;

      if (cardList === undefined) {
        throw new GameError(GameMessage.ILLEGAL_ACTION);
      }
      if (cardList.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.MISCHIEVOUS_TRICK_MAREKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      player.marker.addMarker(this.MISCHIEVOUS_TRICK_MAREKER, this);

      state = store.prompt(state, new ChoosePrizePrompt(
        player.id,
        GameMessage.CHOOSE_PRIZE_CARD,
        { count: 1, allowCancel: false }
      ), prizes => {
        if (prizes && prizes.length > 0) {
          const temp = player.deck.cards[0];
          player.deck.cards[0] = prizes[0].cards[0];
          prizes[0].cards[0] = temp;
        }
      });

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        let damage = 0;
        targets[0].cards.forEach(c => {
          if (c instanceof EnergyCard) {
            damage += 20 * c.provides.length;
          }
        });
        const damageEffect = new PutDamageEffect(effect, damage);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.MISCHIEVOUS_TRICK_MAREKER, this);
    }

    return state;
  }

}
