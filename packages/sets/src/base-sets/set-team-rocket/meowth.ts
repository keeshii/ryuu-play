import {
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class Meowth extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Coin Hurl',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Choose 1 of your opponent\'s Pokémon and flip a coin. If heads, this attack does 20 damage to that Pokémon. ' +
        'Don\'t apply Weakness and Resistance for this attack. (Any other effects that would happen after applying ' +
        'Weakness and Resistance still happen.)'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Meowth';

  public fullName: string = 'Meowth TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const damageOpponentPokemon = commonAttacks.damageOpponentPokemon(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;
      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
        if (result === true) {
          damageOpponentPokemon.use(effect, 20);
        }
      });
    }

    return state;
  }
}
