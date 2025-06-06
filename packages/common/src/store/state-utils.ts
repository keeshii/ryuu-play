import { Card } from './card/card';
import { CardList } from './state/card-list';
import { CardTarget, PlayerType, SlotType } from './actions/play-card-action';
import { CardType } from './card/card-types';
import { GameError } from '../game-error';
import { GameMessage } from '../game-message';
import { State } from './state/state';
import { Player } from './state/player';
import { EnergyMap } from './prompts/choose-energy-prompt';
import { PokemonSlot } from './state/pokemon-slot';

export class StateUtils {
  public static checkEnoughEnergy(energy: EnergyMap[], cost: CardType[]): boolean {
    if (cost.length === 0) {
      return true;
    }

    const provides: CardType[] = [];
    energy.forEach(e => {
      e.provides.forEach(cardType => provides.push(cardType));
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
        default: {
          const index = provides.findIndex(energy => energy === costType);
          if (index !== -1) {
            provides.splice(index, 1);
          } else {
            rainbow += 1;
          }
        }
      }
    });

    // Check if we have enough rainbow energies
    for (let i = 0; i < rainbow; i++) {
      const index = provides.findIndex(energy => energy === CardType.ANY);
      if (index !== -1) {
        provides.splice(index, 1);
      } else {
        return false;
      }
    }

    // Rest cards can be used to pay for colorless energies
    return provides.length >= colorless;
  }

  public static checkExactEnergy(energy: EnergyMap[], cost: CardType[]): boolean {
    let enough = StateUtils.checkEnoughEnergy(energy, cost);
    if (!enough) {
      return false;
    }

    for (let i = 0; i < energy.length; i++) {
      const tempCards = energy.slice();
      tempCards.splice(i, 1);
      enough = StateUtils.checkEnoughEnergy(tempCards, cost);
      if (enough) {
        return false;
      }
    }
    return true;
  }

  public static countAdditionalEnergy(energy: EnergyMap[], cost: CardType[], energyType = CardType.COLORLESS): number {
    let additional = 0;
    const tempCost = [...cost, energyType];
    while (StateUtils.checkEnoughEnergy(energy, tempCost)) {
      additional += 1;
      tempCost.push(energyType);
    }
    return additional;
  }

  public static getOpponent(state: State, player: Player): Player {
    const opponent = state.players.find(p => p.id !== player.id);
    if (opponent === undefined) {
      throw new GameError(GameMessage.INVALID_GAME_STATE);
    }
    return opponent;
  }

  public static getTarget(state: State, player: Player, target: CardTarget): PokemonSlot {
    if (target.player === PlayerType.TOP_PLAYER) {
      player = StateUtils.getOpponent(state, player);
    }
    if (target.slot === SlotType.ACTIVE) {
      return player.active;
    }
    if (target.slot !== SlotType.BENCH) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }
    if (player.bench[target.index] === undefined) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }
    return player.bench[target.index];
  }

  public static findCardList(state: State, card: Card): CardList {
    const cardLists: CardList[] = [];
    for (const player of state.players) {
      cardLists.push(player.active.pokemons);
      cardLists.push(player.active.energies);
      cardLists.push(player.active.trainers);
      cardLists.push(player.deck);
      cardLists.push(player.discard);
      cardLists.push(player.hand);
      cardLists.push(player.stadium);
      cardLists.push(player.supporter);
      player.bench.forEach(item => cardLists.push(item.pokemons, item.energies, item.trainers));
      player.prizes.forEach(item => cardLists.push(item));
    }
    const cardList = cardLists.find(c => c.cards.includes(card));
    if (cardList === undefined) {
      throw new GameError(GameMessage.INVALID_GAME_STATE);
    }
    return cardList;
  }

  public static findPokemonSlot(state: State, card: Card): PokemonSlot | undefined {
    const cardLists: { pokemonSlot: PokemonSlot, cardList: CardList }[] = [];
    for (const player of state.players) {
      cardLists.push({ pokemonSlot: player.active, cardList: player.active.pokemons });
      cardLists.push({ pokemonSlot: player.active, cardList: player.active.energies });
      cardLists.push({ pokemonSlot: player.active, cardList: player.active.trainers });
      player.bench.forEach(item => cardLists.push(
        { pokemonSlot: item, cardList: item.pokemons },
        { pokemonSlot: item, cardList: item.energies },
        { pokemonSlot: item, cardList: item.trainers }
      ));
    }
    const cardList = cardLists.find(c => c.cardList.cards.includes(card));
    return cardList ? cardList.pokemonSlot : undefined;
  }

  public static findOwner(state: State, cardListOrSlot: CardList | PokemonSlot): Player {
    for (const player of state.players) {
      const cardLists: (CardList | PokemonSlot)[] = [];
      cardLists.push(player.active);
      cardLists.push(player.active.pokemons);
      cardLists.push(player.active.energies);
      cardLists.push(player.active.trainers);
      cardLists.push(player.deck);
      cardLists.push(player.discard);
      cardLists.push(player.hand);
      cardLists.push(player.stadium);
      cardLists.push(player.supporter);
      player.bench.forEach(item => cardLists.push(item, item.pokemons, item.energies, item.trainers));
      player.prizes.forEach(item => cardLists.push(item));
      if (cardLists.includes(cardListOrSlot)) {
        return player;
      }
    }
    throw new GameError(GameMessage.INVALID_GAME_STATE);
  }

  public static getStadiumCard(state: State): Card | undefined {
    for (const player of state.players) {
      if (player.stadium.cards.length > 0) {
        return player.stadium.cards[0];
      }
    }
    return undefined;
  }

}
