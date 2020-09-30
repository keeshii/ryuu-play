import { Action, Player, State, PokemonCardList, CardTarget, PlayerType,
  SlotType, GameError, GameMessage, Prompt, ResolvePromptAction } from "../../game";
import { Simulator } from "../../game/bots/simulator";
import { SimpleBotOptions } from "../simple-bot-options";
import { StateScore } from "../state-score/state-score";

export type SimpleTacticList = (new (options: SimpleBotOptions) => SimpleTactic)[];

export abstract class SimpleTactic {

  private stateScore: StateScore;

  constructor(protected options: SimpleBotOptions) {
    this.stateScore = new StateScore(this.options);
  }

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

  protected simulateAction(state: State, action: Action): State | undefined {
    let newState = state;
    try {
      const simulator = new Simulator(state, this.options.arbiter);
      newState = simulator.dispatch(action);
      
      while (simulator.store.state.prompts.some(p => p.result === undefined)) {
        newState = simulator.store.state;
        const prompt = newState.prompts.find(p => p.result === undefined);
        if (prompt === undefined) {
          break;
        }
        const player = newState.players.find(p => p.id === prompt.playerId);
        if (player === undefined) {
          break;
        }
        const resolveAction = this.resolvePrompt(newState, player, prompt);
        newState = simulator.dispatch(resolveAction);
      }
    } catch (error) {
      return undefined;
    }

    return newState;
  }

  private resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action {
    const resolvers = this.options.promptResolvers.map(resolver => new resolver(this.options));

    for (let i = 0; i < resolvers.length; i++) {
      const action = resolvers[i].resolvePrompt(state, player, prompt);
      if (action !== undefined) {
        return action;
      }
    }

    // Unknown prompt. Try to cancel it.
    return new ResolvePromptAction(prompt.id, null);
  }

  protected getStateScore(state: State, playerId: number): number {
    return this.stateScore.getScore(state, playerId);
  }

  protected evaluateAction(state: State, playerId: number, action: Action): number | undefined {
    const newState = this.simulateAction(state, action);
    const newPlayer = newState && newState.players.find(p => p.id === playerId);
    if (newState !== undefined && newPlayer !== undefined) {
      return this.stateScore.getScore(newState, playerId);
    }
  }

}
