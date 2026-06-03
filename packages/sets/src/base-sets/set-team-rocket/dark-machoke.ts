import {
  AttackEffect,
  CardType,
  ChoosePokemonPrompt,
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

export class DarkMachoke extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Machop';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Drag Off',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: '20',
      text:
        'Before doing damage, choose 1 of your opponent\'s Benched Pokémon and switch it with the Defending Pokémon. ' +
        'Do the damage to the new Defending Pokémon. This attack can\'t be used if your opponent has no Benched ' +
        'Pokémon.'
    },
    {
      name: 'Knock Back',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: '30',
      text:
        'If your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with the Defending ' +
        'Pokémon. (Do the damage before switching the Pokémon.)'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Machoke';

  public fullName: string = 'Dark Machoke TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const opponentSwitchesDamageFirst = commonAttacks.opponentSwitchesDamageFirst(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.pokemons.cards.length > 0);

      if (!hasBench) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ),
        targets => {
          if (targets && targets.length > 0) {
            player.switchPokemon(targets[0]);
          }
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return opponentSwitchesDamageFirst.use(effect);
    }

    return state;
  }
}
