import { Action, Player, State, PokemonCardList, CardTarget, PlayerType,
  SlotType, GameError, GameMessage } from "../../game";


import { SimpleBotOptions } from "../simple-bot-options";

export type SimpleTacticList = (new (options: SimpleBotOptions) => SimpleTactic)[];

export abstract class SimpleTactic {

  constructor(protected options: SimpleBotOptions) { }

  public abstract useTactic(state: State, player: Player): Action | undefined;

  protected getCardTarget(player: Player, state: State, target: PokemonCardList): CardTarget {
    if (target === player.active) {
      return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
    }

    for (let index = 0; index < player.bench.length; index++) {
      if (target === player.bench[index]) {
        return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index };
      }
    }

    const opponent = state.players.find(p => p !== player);
    if (opponent === undefined) {
      throw new GameError(GameMessage.INVALID_GAME_STATE);
    }

    if (target === opponent.active) {
      return { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 };
    }

    for (let index = 0; index < opponent.bench.length; index++) {
      if (target === opponent.bench[index]) {
        return { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index };
      }
    }

    throw new GameError(GameMessage.INVALID_TARGET);
  }

}
