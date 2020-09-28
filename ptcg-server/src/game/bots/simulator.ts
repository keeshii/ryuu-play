import { Store } from "../store/store";
import { Action } from "../store/actions/action";
import { BotArbiter, BotArbiterOptions } from "./bot-arbiter";
import { State } from "../store/state/state";
import { StoreHandler } from "../store/store-handler";
import { GameError, GameMessage } from "../game-error";
import { ResolvePromptAction } from "../store/actions/resolve-prompt-action";
import { deepClone } from "../../utils";


export class Simulator implements StoreHandler {
  public store: Store;
  private botArbiter: BotArbiter;

  constructor(state: State, botArbiterOptions: Partial<BotArbiterOptions> = {}) {
    if (state.prompts.some(p => p.result === undefined)) {
      throw new GameError(GameMessage.SIMULATOR_STATE_NOT_STABLE);
    }
    this.botArbiter = new BotArbiter(botArbiterOptions);
    this.store = new Store(this);
    this.store.state = deepClone(state);
  }

  public clone(): Simulator {
    return new Simulator(this.store.state);
  }

  public onStateChange(state: State): void {}

  private handleArbiterPrompts(state: State): ResolvePromptAction | undefined {
    let resolved: {id: number, action: ResolvePromptAction} | undefined;
    const unresolved = state.prompts.filter(item => item.result === undefined);

    for (let i = 0; i < unresolved.length; i++) {
      let action = this.botArbiter.resolvePrompt(state, unresolved[i]);
      if (action !== undefined) {
        resolved = { id: unresolved[i].id, action };
        break;
      }
    }

    return resolved ? resolved.action : undefined;
  }

  public dispatch(action: Action): State {
    let state = this.store.dispatch(action);

    let resolve = this.handleArbiterPrompts(this.store.state);
    while (resolve !== undefined) {
      state = this.store.dispatch(resolve);
      resolve = this.handleArbiterPrompts(this.store.state);
    }

    return state;
  }

}
