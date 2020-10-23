import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SpecialCondition, CardTag } from "../../game/store/card/card-types";
import { StoreLike, State, StateUtils, Card, CoinFlipPrompt,
  ChoosePokemonPrompt, PlayerType, SlotType } from "../../game";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { Effect } from "../../game/store/effects/effect";
import { CheckProvidedEnergyEffect } from "../../game/store/effects/check-effects";
import { CardMessage } from "../card-message";
import { DiscardCardsEffect, AddSpecialConditionsEffect,
  DealDamageAfterWeaknessEffect } from "../../game/store/effects/attack-effects";


export class RaikouEx extends PokemonCard {

  public tags = [ CardTag.POKEMON_EX ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 170;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Thunder Fang',
      cost: [ CardType.LIGHTNING, CardType.COLORLESS ],
      damage: 30,
      text: 'Flip a coin. If heads, the Defending Pokemon is now Paralyzed.'
    }, {
      name: 'Volt Bolt',
      cost: [ CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS ],
      damage: 0,
      text: 'Discard all L Energy attached to this Pokemon. This attack ' +
        'does 100 damage to 1 of your opponent\'s Pokemon. ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokemon.)'
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Raikou EX';

  public fullName: string = 'Raikou EX DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, CardMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const addSpecialConditionsEffect = new AddSpecialConditionsEffect(
            player, [SpecialCondition.PARALYZED],
            effect.attack, opponent.active, player.active
          );
          store.reduceEffect(state, addSpecialConditionsEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const cards: Card[] = [];
      checkProvidedEnergy.energyMap.forEach(em => {
        if (em.provides.includes(CardType.WATER) || em.provides.includes(CardType.ANY)) {
          cards.push(em.card);
        }
      });

      const discardEnergy = new DiscardCardsEffect(player, cards,
        effect.attack, player.active, player.active);
      store.reduceEffect(state, discardEnergy);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        CardMessage.CHOOSE_ONE_POKEMON,
        PlayerType.TOP_PLAYER,
        [ SlotType.BENCH ],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new DealDamageAfterWeaknessEffect(
          player, 100, effect.attack, targets[0], player.active);
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }

}
