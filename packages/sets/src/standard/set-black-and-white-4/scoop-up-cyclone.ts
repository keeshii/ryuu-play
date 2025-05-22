import {
  CardTag,
  ChoosePokemonPrompt,
  Effect,
  GameMessage,
  PlayerType,
  SlotType,
  State,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class ScoopUpCyclone extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public tags = [CardTag.ACE_SPEC];

  public set: string = 'BW4';

  public name: string = 'Scoop Up Cyclone';

  public fullName: string = 'Scoop Up Cyclone PLB';

  public text: string = 'Put 1 of your Pokémon and all cards attached to it into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: true }
        ),
        result => {
          const targets = result || [];

          // Operation cancelled by user
          if (targets.length === 0) {
            return;
          }

          // Discard trainer card
          player.hand.moveCardTo(this, player.discard);

          targets.forEach(target => {
            target.moveTo(player.hand);
            target.clearEffects();
          });
        }
      );
    }

    return state;
  }
}
