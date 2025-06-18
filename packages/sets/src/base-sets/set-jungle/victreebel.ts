import {
  AttackEffect,
  CardType,
  ChoosePokemonPrompt,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class Victreebel extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Weepinbell';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Lure',
      cost: [CardType.GRASS],
      damage: '',
      text: 'If your opponent has any Benched Pokémon, choose 1 of them and switch it with his or her Active Pokémon.'
    },
    {
      name: 'Acid',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon can\'t retreat during your next turn.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Victreebel';

  public fullName: string = 'Victreebel JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    const cantRetreat = commonAttacks.cantRetreat(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.pokemons.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ),
        targets => {
          if (targets && targets.length > 0) {
            opponent.switchPokemon(targets[0]);
          }
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          cantRetreat.use(effect);
        }
      });
    }

    return state;
  }
}
