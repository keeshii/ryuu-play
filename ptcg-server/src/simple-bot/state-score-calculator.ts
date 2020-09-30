/*

import { State, PlayerType, SuperType, StateUtils, GameError, GameMessage } from '../game';
import { StateScores } from './simple-bot-options';

export const defaultStateScores: StateScores = {
  prizeCard: 1000,
  deckCard: 1,
  opponentHand: -5,
  opponentDeck: -1,
  lessThan50Hp: -100,
  noBenchPokemon: -100,
  noHandCards: 100,
  pokemonSlot: 10,
  attachedEnergy: 25,
  missingEnergy: -5,
  lessThan10DeckCards: -10
};

export class StateScoreCalculator {

  constructor(private scores: StateScores) { }

  public getStateScore(state: State, playerId: number): number {
    const player = state.players.find(p => p.id === playerId);
    if (player === undefined) {
      throw new GameError(GameMessage.INVALID_GAME_STATE);
    }
    const opponent = StateUtils.getOpponent(state, player);
    const scores = this.scores;
    let score = 0;

    // 1000 points for each prize card less than opponent
    const playerPrizes = player.prizes.filter(p => p.cards.length !== 0);
    const opponentPrizes = opponent.prizes.filter(p => p.cards.length !== 0);
    score += scores.prizeCard * (opponentPrizes.length - playerPrizes.length);

    // 1 point for each card in the deck
    score += scores.deckCard * player.deck.cards.length;

    // -5 points for each card on opponents hand
    // -1 point for each card in the opponents deck
    score += scores.opponentHand * opponent.hand.cards.length;
    score += scores.opponentDeck * opponent.deck.cards.length;

    // -100 points, if our active pokemon has less than 50 hp
    const pokemon = player.active.getPokemonCard();
    if (pokemon && pokemon.hp - 50 < player.active.damage) {
      score += scores.lessThan50Hp;
    }

    // -100 points, if no we don't have a benched pokemon
    const benched = player.bench.filter(b => b.cards.length !== 0);
    if (benched.length === 0) {
      score += scores.noBenchPokemon;
    }

    // -100 points, if no cards in the hand
    if (player.hand.cards.length === 0) {
      score += scores.noHandCards;
    }

    // 25 points for each energy attached to our pokemon
    // 10 points for each pokemon in the play
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, p => {
      const energy = p.cards.filter(c => c.superType === SuperType.ENERGY);
      score += scores.attachedEnergy * energy.length;
      score += scores.pokemonSlot;
    });

    // -10 points, if our deck has less than 10 cards
    if (player.deck.cards.length < 10) {
      score += scores.lessThan10DeckCards * (10 - player.deck.cards.length);
    }

    return score;
  }

}
*/
