import { TrainerCard } from '@ptcg/common';
import { TrainerType, CardTag, SuperType } from '@ptcg/common';
import { StoreLike } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { ChoosePokemonPrompt } from '@ptcg/common';
import { TrainerEffect } from '@ptcg/common';
import { PlayerType, SlotType, GameError, PokemonCardList, ChooseCardsPrompt, EnergyCard } from '@ptcg/common';
import { GameMessage } from '@ptcg/common';


function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const hasBench = player.bench.some(b => b.cards.length > 0);

  if (hasBench === false) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Do not discard the card yet
  effect.preventDefault = true;

  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_SWITCH,
    PlayerType.BOTTOM_PLAYER,
    [ SlotType.BENCH ],
    { allowCancel: true }
  ), results => {
    targets = results || [];
    next();
  });

  if (targets.length === 0) {
    return state;
  }

  const target = targets[0];
  const hasEnergies = player.active.cards.some(c => c instanceof EnergyCard);

  if (hasEnergies) {
    yield store.prompt(state, new ChooseCardsPrompt(
      player.id,
      GameMessage.ATTACH_ENERGY_TO_BENCH,
      player.active,
      { superType: SuperType.ENERGY },
      { allowCancel: false, min: 0 }
    ), selected => {
      selected = selected || [];
      player.active.moveCardsTo(selected, target);
      next();
    });
  }

  // Discard trainer only when user selected a Pokemon
  player.hand.moveCardTo(effect.trainerCard, player.discard);

  player.switchPokemon(targets[0]);
  return state;
}

export class ScrambleSwitch extends TrainerCard {

  public tags = [ CardTag.ACE_SPEC ];

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BW2';

  public name: string = 'Scramble Switch';

  public fullName: string = 'Scramble Switch PS';

  public text: string =
    'Switch your Active Pokemon with 1 of your Benched Pokemon. ' +
    'Then, you may move as many Energy attached to the old Active Pokemon ' +
    'to the new Active Pokemon as you like.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}
