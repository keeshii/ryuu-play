import { Card } from "./card/card";
import { CardList } from "./state/card-list";
import { CardTarget, PlayerType, SlotType } from "./actions/play-card-action";
import { CardType, SuperType } from "./card/card-types";
import { GameError, GameMessage } from "../game-error";
import { EnergyCard } from "./card/energy-card";
import { State } from "./state/state";
import { Player } from "./state/player";
import { PokemonCardList } from "./state/pokemon-card-list";

export class StateUtils {
  public static checkEnoughEnergy(cards: Card[], cost: CardType[]): boolean {
    if (cost.length === 0) {
      return true;
    }

    const provided: CardType[] = [];
    cards.forEach(card => {
      if (card.superType === SuperType.ENERGY) {
        (card as EnergyCard).provides.forEach(energy => provided.push(energy));
      }
    });

    let colorless = 0;
    let rainbow = 0;

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
            rainbow += 1;
          }
      }
    });

    // Check if we have enough rainbow energies
    for (let i = 0; i < rainbow; i++) {
      const index = provided.findIndex(energy => energy === CardType.ANY);
      if (index !== -1) {
        provided.splice(index, 1);
      } else {
        return false;
      }
    }

    // Rest cards can be used to pay for colorless energies
    return provided.length >= colorless;
  }

  public static checkExactEnergy(cards: Card[], cost: CardType[]): boolean {
    let enough = StateUtils.checkEnoughEnergy(cards, cost);
    if (!enough) {
      return false;
    }
    cards = cards.filter(c => c.superType === SuperType.ENERGY);

    for (let i = 0; i < cards.length; i++) {
      const tempCards = cards.slice();
      tempCards.splice(i, 1);
      enough = StateUtils.checkEnoughEnergy(tempCards, cost);
      if (enough) {
        return false;
      }
    }
    return true;
  }

  public static getOpponent(state: State, player: Player): Player {
    const opponent = state.players.find(p => p.id !== player.id);
    if (opponent === undefined) {
      throw new GameError(GameMessage.INVALID_GAME_STATE);
    }
    return opponent;
  }

  public static getTarget(state: State, player: Player, target: CardTarget): PokemonCardList {
    if (target.player === PlayerType.TOP_PLAYER) {
      player = StateUtils.getOpponent(state, player);
    }
    if (target.slot === SlotType.ACTIVE) {
      return player.active;
    }
    if (player.bench[target.index] === undefined) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }
    return player.bench[target.index];
  }

  public static findCardList(state: State, card: Card): CardList {
    const cardLists: CardList[] = [];
    for (const player of state.players) {
      cardLists.push(player.active);
      cardLists.push(player.deck);
      cardLists.push(player.discard);
      cardLists.push(player.hand);
      cardLists.push(player.stadium);
      player.bench.forEach(item => cardLists.push(item));
      player.prizes.forEach(item => cardLists.push(item));
    }
    const cardList = cardLists.find(c => c.cards.includes(card));
    if (cardList === undefined) {
      throw new GameError(GameMessage.INVALID_GAME_STATE);
    }
    return cardList;
  }

  public static findOwner(state: State, cardList: CardList): Player {
    for (const player of state.players) {
      const cardLists: CardList[] = [];
      cardLists.push(player.active);
      cardLists.push(player.deck);
      cardLists.push(player.discard);
      cardLists.push(player.hand);
      cardLists.push(player.stadium);
      player.bench.forEach(item => cardLists.push(item));
      player.prizes.forEach(item => cardLists.push(item));
      if (cardLists.includes(cardList)) {
        return player;
      }
    }
    throw new GameError(GameMessage.INVALID_GAME_STATE);
  }

}
