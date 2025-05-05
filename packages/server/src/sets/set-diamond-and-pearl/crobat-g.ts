import { Effect } from '@ptcg/common';
import { PokemonCard } from '@ptcg/common';
import { PowerType, StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType,
  StateUtils } from '@ptcg/common';
import { Stage, CardType, CardTag, SpecialCondition } from '@ptcg/common';
import { PlayPokemonEffect } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';
import { AttackEffect, PowerEffect } from '@ptcg/common';
import { AddSpecialConditionsEffect } from '@ptcg/common';

function* useFlashBite(next: Function, store: StoreLike, state: State, effect: PlayPokemonEffect): IterableIterator<State> {
  const player = effect.player;

  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
    PlayerType.TOP_PLAYER,
    [ SlotType.ACTIVE, SlotType.BENCH ],
    { allowCancel: true },
  ), selected => {
    if (!selected || selected.length === 0) {
      return state;
    }

    const target = selected[0];
    target.damage += 10;
    next();
  });

  return state;
}


export class CrobatG extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public tags = [ CardTag.POKEMON_SP ];

  public hp: number = 80;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [ ];

  public powers = [{
    name: 'Flash Bite',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Crobat G from your hand ' +
      'onto your Bench, you may put 1 damage counter on 1 of your ' +
      'opponent\'s Pokémon.'
  }];

  public attacks = [
    {
      name: 'Toxic Fang',
      cost: [ CardType.PSYCHIC, CardType.COLORLESS ],
      damage: 0,
      text: 'The Defending Pokémon is now Poisoned. Put 2 damage counters ' +
      ' instead of 1 on the Defending Pokémon between turns.'
    }
  ];

  public set: string = 'DP';

  public name: string = 'Crobat G';

  public fullName: string = 'Crobat G PL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const player = StateUtils.findOwner(state, effect.target);
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      const generator = useFlashBite(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      specialCondition.poisonDamage = 20;
      store.reduceEffect(state, specialCondition);
    }

    return state;
  }

}
