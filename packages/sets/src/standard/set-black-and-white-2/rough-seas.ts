import {
  CardType,
  Effect,
  GameError,
  GameMessage,
  HealEffect,
  PlayerType,
  PokemonSlot,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerType,
  UseStadiumEffect,
} from '@ptcg/common';

export class RoughSeas extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BW2';

  public name: string = 'Rough Seas';

  public fullName: string = 'Rough Seas PCL';

  public text: string =
    'Once during each player\'s turn, that player may heal 30 damage ' +
    'from each of his or her W Pokémon and L Pokémon.';

  public useWhenInPlay = true;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;

      const targets: PokemonSlot[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const isWater = card.cardTypes.includes(CardType.WATER);
        const isLightning = card.cardTypes.includes(CardType.LIGHTNING);
        if ((isWater || isLightning) && cardList.damage > 0) {
          targets.push(cardList);
        }
      });

      if (targets.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_STADIUM);
      }

      targets.forEach(target => {
        // Heal Pokemon
        const healEffect = new HealEffect(player, target, 30);
        store.reduceEffect(state, healEffect);
      });
    }

    return state;
  }
}
