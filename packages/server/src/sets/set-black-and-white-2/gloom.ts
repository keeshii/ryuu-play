import { PokemonCard } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { Stage, CardType, SpecialCondition } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { AttackEffect } from '@ptcg/common';
import { CoinFlipPrompt } from '@ptcg/common';
import { SelectPrompt } from '@ptcg/common';
import { AddSpecialConditionsEffect } from '@ptcg/common';

function* useMiraclePowder(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  let flip = false;
  yield store.prompt(state, [
    new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
  ], result => {
    flip = result;
    next();
  });

  if (!flip) {
    return state;
  }

  const options: { message: GameMessage, value: SpecialCondition }[] = [
    { message: GameMessage.SPECIAL_CONDITION_PARALYZED, value: SpecialCondition.PARALYZED },
    { message: GameMessage.SPECIAL_CONDITION_CONFUSED, value: SpecialCondition.CONFUSED },
    { message: GameMessage.SPECIAL_CONDITION_ASLEEP, value: SpecialCondition.ASLEEP },
    { message: GameMessage.SPECIAL_CONDITION_POISONED, value: SpecialCondition.POISONED },
    { message: GameMessage.SPECIAL_CONDITION_BURNED, value: SpecialCondition.BURNED }
  ];

  return store.prompt(state, new SelectPrompt(
    player.id,
    GameMessage.CHOOSE_SPECIAL_CONDITION,
    options.map(c => c.message),
    { allowCancel: false }
  ), choice => {
    const option = options[choice];

    if (option !== undefined) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [option.value]);
      store.reduceEffect(state, specialConditionEffect);
    }
  });
}

export class Gloom extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Oddish';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Miracle Powder',
    cost: [ CardType.GRASS, CardType.COLORLESS ],
    damage: 30,
    text: 'Flip a coin. If heads, choose 1 Special Condition. ' +
      'The Defending Pokemon is now affected by that Special Condition.'
  }];

  public set: string = 'BW2';

  public name: string = 'Gloom';

  public fullName: string = 'Gloom UND';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useMiraclePowder(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
