import {
  CardType,
  CheckPokemonTypeEffect,
  DealDamageEffect,
  Effect,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerType,
} from '@ptcg/common';

export class DarkClaw extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BW2';

  public name: string = 'Dark Claw';

  public fullName: string = 'Dark Claw DEX';

  public text: string =
    'If this card is attached to a D Pokémon, each of the attacks ' +
    'of that Pokémon does 20 more damage to the Active Pokémon ' +
    '(before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && effect.source.tool === this) {
      const opponent = StateUtils.findOwner(state, effect.target);

      // Not active Pokemon
      if (opponent.active !== effect.target) {
        return state;
      }

      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if (checkPokemonTypeEffect.cardTypes.includes(CardType.DARK)) {
        effect.damage += 20;
      }
    }

    return state;
  }
}
