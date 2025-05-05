import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, CardTag } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State, GamePhase } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { AttackEffect, PowerEffect } from '@ptcg/common';
import { PutDamageEffect } from '@ptcg/common';
import { PowerType } from '@ptcg/common';
import { StateUtils } from '@ptcg/common';
import { ConfirmPrompt } from '@ptcg/common';
import { ChoosePokemonPrompt } from '@ptcg/common';
import { PlayerType, SlotType } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';

function* useWhirlwind(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const opponentHasBenched = opponent.bench.some(b => b.cards.length > 0);
  if (!opponentHasBenched) {
    return state;
  }

  let wantToUse = false;
  yield store.prompt(state, new ConfirmPrompt(
    effect.player.id,
    GameMessage.WANT_TO_SWITCH_POKEMON
  ), result => {
    wantToUse = result;
    next();
  });

  if (!wantToUse) {
    return state;
  }

  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
    PlayerType.TOP_PLAYER,
    [ SlotType.BENCH ],
    { allowCancel: false },
  ), selected => {
    if (!selected || selected.length === 0) {
      return state;
    }

    const target = selected[0];
    opponent.switchPokemon(target);
    next();
  });

  return state;
}

export class Beautifly extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Silcoon';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 130;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ ];

  public powers = [{
    name: 'Miraculous Scales',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to this Pokemon by attacks from your ' +
      'opponent\'s Pokemon-EX.'
  }];

  public attacks = [{
    name: 'Whirlwind',
    cost: [ CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 80,
    text: 'You may have your opponent switch his or her Active Pokemon ' +
      'with 1 of his or her Benched Pokemon.'
  }];

  public set: string = 'BW2';

  public name: string = 'Beautifly';

  public fullName: string = 'Beautifly ROS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useWhirlwind(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    // Prevent damage from Pokemon-EX
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      // Card is not active, or damage source is unknown
      if (pokemonCard !== this || sourceCard === undefined) {
        return state;
      }

      // Do not ignore self-damage from Pokemon-Ex
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.findOwner(state, effect.source);
      if (player === opponent) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      if (sourceCard.tags.includes(CardTag.POKEMON_EX)) {

        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }

        effect.preventDefault = true;
      }
    }

    return state;
  }

}
