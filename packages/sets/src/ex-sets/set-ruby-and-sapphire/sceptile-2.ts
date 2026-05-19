import {
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameError,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';
import { commonPowers } from '../../common';


export class Sceptile2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Grovyle';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 100;

  public powers = [
    {
      name: 'Energy Trans',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'As often as you like during your turn (before your attack), move a G Energy card attached to 1 of your ' +
        'Pokémon to another of your Pokémon. This power can\'t be used if Sceptile is affected by a Special ' +
        'Condition.',
    },
  ];

  public attacks = [
    {
      name: 'Tail Rap',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50×',
      text: 'Flip 2 coins. This attack does 50 damage times the number of heads.',
    },
  ];

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.WATER, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Sceptile';

  public fullName: string = 'Sceptile RS-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const energyTrans = commonPowers.energyTrans(this, store, state, effect);
    
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const pokemonSlot = StateUtils.findPokemonSlot(state, effect.card);

      if (pokemonSlot === undefined
        || pokemonSlot.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      energyTrans.reduce(this.powers[0], CardType.GRASS);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(
        state,
        [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)],
        results => {
          let heads: number = 0;
          results.forEach(r => {
            heads += r ? 1 : 0;
          });
          effect.damage = 50 * heads;
        }
      );
    }

    return state;
  }
}
