import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, ChooseEnergyPrompt, Card, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect, DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';


export class Garchomp extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Gabite';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 130;

  public weakness = [{ type: CardType.COLORLESS, value: 30 }];

  public retreat = [ ];

  public attacks = [
    {
      name: 'Dragon Rage',
      cost: [ CardType.COLORLESS ],
      damage: 80,
      text: 'Flip 2 coins. If either of them is tails, this attack does nothing.'
    },
    {
      name: 'Jet Sword',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 100,
      text: 'Discard 2 Energy attached to Garchomp and this attack does 10 ' +
        'damage to each of your opponent\'s Benched Pokemon. (Don\'t apply ' +
        'Weakness and Resistance for Benched Pokemon.)'
    }
  ];

  public set: string = 'OP9';

  public name: string = 'Garchomp';

  public fullName: string = 'Garchomp OP9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        if (results.some(r => r === false)) {
          effect.damage = 0;
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

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
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });

      opponent.bench.forEach(benched => {
        if (benched.cards.length > 0) {
          const dealDamage = new PutDamageEffect(effect, 10);
          dealDamage.target = benched;
          return store.reduceEffect(state, dealDamage);
        }
      });
    }

    return state;
  }

}
