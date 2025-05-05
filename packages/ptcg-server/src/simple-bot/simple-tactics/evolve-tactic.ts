import { Action, Player, State, PokemonCard, PlayerType, CardTarget, PlayCardAction } from '../../game';
import { SimpleTactic } from './simple-tactics';

export class EvolveTactic extends SimpleTactic {

  public useTactic(state: State, player: Player): Action | undefined {
    const pokemons: {card: PokemonCard, target: CardTarget}[] = [];

    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
      if (cardList.pokemonPlayedTurn !== state.turn) {
        pokemons.push({ card, target });
      }
    });

    for (let i = 0; i < pokemons.length; i++) {
      const evolution = player.hand.cards.find(c => {
        return c instanceof PokemonCard && c.evolvesFrom === pokemons[i].card.name;
      });
      if (evolution) {
        return new PlayCardAction(
          player.id,
          player.hand.cards.indexOf(evolution),
          pokemons[i].target
        );
      }
    }
  }

}
