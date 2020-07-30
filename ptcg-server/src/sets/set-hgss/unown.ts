import { CardMessage } from "../card-message";
import { Effect } from "../../game/store/effects/effect";
import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SuperType } from "../../game/store/card/card-types";
import { PlayPokemonEffect } from "../../game/store/effects/play-card-effects";
import { PowerType, StoreLike, State, ConfirmPrompt, ChoosePokemonPrompt,
  PlayerType, SlotType, PokemonCardList } from "../../game";

function* useReturn(next: Function, store: StoreLike, state: State, effect: PlayPokemonEffect): IterableIterator<State> {
  const player = effect.player;

  let wantToUse = false;
  yield store.prompt(state, new ConfirmPrompt(
    effect.player.id,
    CardMessage.USE_RETURN_ABILITY,
  ), result => {
    wantToUse = result;
    next();
  });

  if (!wantToUse) {
    return state;
  }

  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    CardMessage.CHOOSE_ONE_POKEMON,
    PlayerType.BOTTOM_PLAYER,
    [ SlotType.ACTIVE, SlotType.BENCH ],
    { allowCancel: true }
  ), selection => {
    targets = selection || [];
    next();
  });

  if (targets.length === 0) {
    return state;
  }

  const energyCards = targets[0].cards.filter(c => c.superType === SuperType.ENERGY);
  targets[0].moveCardsTo(energyCards, player.hand);
  return state;
}

export class Unown extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 50;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Return',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Unown from your hand onto ' +
      'your Bench, you may return all Energy attached to 1 of your Pokemon ' +
      'to your hand.'
  }];

  public attacks = [
    {
      name: 'Hidden Power',
      cost: [ CardType.PSYCHIC ],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'HGSS';

  public name: string = 'Unown';

  public fullName: string = 'Unown HGSS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      let generator: IterableIterator<State>;
      generator = useReturn(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
