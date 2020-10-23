import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, CardTag } from "../../game/store/card/card-types";
import { StoreLike, State, PowerType, PlayerType, SlotType, PokemonCardList } from "../../game";
import { PowerEffect, AttackEffect } from "../../game/store/effects/game-effects";
import { Effect } from "../../game/store/effects/effect";
import { CheckProvidedEnergyEffect } from "../../game/store/effects/check-effects";


export class KeldeoEx extends PokemonCard {

  public tags = [ CardTag.POKEMON_EX ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 170;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Rush In',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokemon is ' +
      'on your Bench, you may switch this Pokemon with your Active Pokemon.'
  }];

  public attacks = [
    {
      name: 'Secret Sword',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 50,
      text: 'Does 20 more damage for each W Energy attached to this Pokemon.'
    }
  ];

  public set: string = 'BW2';

  public name: string = 'Keldeo EX';

  public fullName: string = 'Keldeo EX BC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      let bench: PokemonCardList | undefined;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card === this && target.slot === SlotType.BENCH) {
          bench = cardList;
        }
      });

      if (bench !== undefined) {
        player.switchPokemon(bench);
      }

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.WATER || cardType === CardType.ANY
        }).length;
      });
      effect.damage += energyCount * 20;
    }

    return state;
  }

}
