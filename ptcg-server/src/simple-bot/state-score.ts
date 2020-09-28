import {State, PlayerType, SuperType, PokemonCardList, CardType,
  EnergyCard} from "../game";

export interface StateScoreOptions {
  prizeCard: number;
  deckCard: number;
  opponentHand: number;
  opponentDeck: number;
  lessThan50Hp: number;
  noBenchPokemon: number;
  noHandCards: number;
  pokemonSlot: number;
  attachedEnergy: number;
  missingEnergy: number;
  lessThan10DeckCards: number;
}

export class StateScore {

  private options: StateScoreOptions;

  constructor(options: Partial<StateScoreOptions> = {}) {
    this.options = Object.assign({
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
    }, options);
  }

  getStateScore(state: State, playerNumber: number): number {
    const player = state.players[playerNumber];
    const opponent = state.players[playerNumber ? 0 : 1];
    const options = this.options;
    let score = 0;

    if (player === undefined || opponent === undefined) {
      return score;
    }

    // 1000 points for each prize card less than opponent
    const playerPrizes = player.prizes.filter(p => p.cards.length !== 0);
    const opponentPrizes = opponent.prizes.filter(p => p.cards.length !== 0);
    score += options.prizeCard * (opponentPrizes.length - playerPrizes.length);

    // 1 point for each card in the deck
    score += options.deckCard * player.deck.cards.length;

    // -5 points for each card on opponents hand
    // -1 point for each card in the opponents deck
    score += options.opponentHand * opponent.hand.cards.length;
    score += options.opponentDeck * opponent.deck.cards.length;

    // -100 points, if our active pokemon has less than 50 hp
    const pokemon = player.active.getPokemonCard();
    if (pokemon && pokemon.hp - 50 < player.active.damage) {
      score += options.lessThan50Hp;
    }

    // -100 points, if no we don't have a benched pokemon
    const benched = player.bench.filter(b => b.cards.length !== 0);
    if (benched.length === 0) {
      score += options.noBenchPokemon;
    }

    // -100 points, if no cards in the hand
    if (player.hand.cards.length === 0) {
      score += options.noHandCards;
    }

    // 25 points for each energy attached to our pokemon
    // 10 points for each pokemon in the play
    // -5 points for each missing energy on that pokemon
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, p => {
      const energy = p.cards.filter(c => c.superType === SuperType.ENERGY);
      const missing = this.getMissingEnergies(p);
      score += options.attachedEnergy * energy.length;
      score += options.pokemonSlot;
      score += options.missingEnergy * missing.length;
    });

    // -10 points, if our deck has less than 10 cards
    if (player.deck.cards.length < 10) {
      score += options.lessThan10DeckCards * (10 - player.deck.cards.length);
    }

    return score;
  }


  private getMissingEnergies(cardList: PokemonCardList): CardType[] {
    const pokemon = cardList.getPokemonCard();
    if (pokemon === undefined || pokemon.attacks.length === 0) {
      return [];
    }

    const cost = pokemon.attacks[pokemon.attacks.length - 1].cost;
    if (cost.length === 0) {
      return [];
    }

    const provided: CardType[] = [];
    cardList.cards.forEach(card => {
      if (card instanceof EnergyCard) {
        card.provides.forEach(energy => provided.push(energy));
      }
    });

    const missing: CardType[] = [];
    let colorless = 0;
    // First remove from array cards with specific energy types
    cost.forEach(costType => {
      switch (costType) {
        case CardType.ANY:
        case CardType.NONE:
          break;
        case CardType.COLORLESS:
          colorless += 1;
          break;
        default:
          const index = provided.findIndex(energy => energy === costType);
          if (index !== -1) {
            provided.splice(index, 1);
          } else {
            missing.push(costType);
          }
      }
    });

    for (let i = 0; i < colorless; i++) {
      missing.push(CardType.ANY);
    }

    return missing;
  }

}
