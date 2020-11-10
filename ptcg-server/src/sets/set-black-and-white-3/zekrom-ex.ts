import { CheckProvidedEnergyEffect } from "../../game/store/effects/check-effects";
import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, CardTag } from "../../game/store/card/card-types";
import { StoreLike, State, CoinFlipPrompt, ChooseEnergyPrompt, Card } from "../../game";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { Effect } from "../../game/store/effects/effect";
import { GameMessage } from "../../game/game-message";

export class ZekromEx extends PokemonCard {

  public tags = [ CardTag.POKEMON_EX ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 180;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Glinting Claw',
      cost: [ CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 50,
      text: 'Flip a coin. If heads, this attack does 30 more damage.'
    }, {
      name: 'Strong Volt',
      cost: [ CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 150,
      text: 'Discard 2 Energy attached to this Pokemon.'
    },
  ];

  public set: string = 'BW3';

  public name: string = 'Zekrom EX';

  public fullName: string = 'Zekrom EX NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          effect.damage += 30;
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [ CardType.COLORLESS, CardType.COLORLESS ],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        effect.player.active.moveCardsTo(cards, player.discard);
      });
    }

    return state;
  }

}
