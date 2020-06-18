import { Action } from "./actions/action";
import { Prompt } from "./prompts/prompt";
import { ReorderHandAction } from "./actions/reorder-hand-action";
import { ResolvePromptAction } from "./actions/resolve-prompt-action";
import { State } from "./state/state";
import { GameError, GameMessage } from "../game-error";
import { StoreHandler } from "./store-handler";
import { StoreLike } from "./store-like";

import { playerTurnReducer } from "./reducers/player-turn-reducer";
import { reorderReducer} from "./reducers/reorder-reducer";
import { setupPhaseReducer } from './reducers/setup-reducer';
import { generateId } from "../../utils/utils";
import { StateLogLevel, StateLog } from "./state/state-log";

interface PromptItem {
  ids: number[],
  then: (results: any) => void;
}

export class Store implements StoreLike {

  public state: State = new State();
  private promptItems: PromptItem[] = [];
  private logId: number = 0;

  constructor(private handler: StoreHandler) { };

  public dispatch(action: Action): State {
    let state = this.state;

    if (action instanceof ReorderHandAction) {
      state = reorderReducer(this, state, action);
    }

    if (action instanceof ResolvePromptAction) {
      state = this.reducePrompt(state, action);
      this.handler.onStateChange(state);
      return state;
    }

    if (state.prompts.some(p => p.result === undefined)) {
      throw new GameError(GameMessage.ACTION_IN_PROGRESS);
    }

    try {
      state = this.reduce(state, action);
    } catch (storeError) {
      // Illegal action
      throw storeError;
    }

    this.state = state;
    this.handler.onStateChange(state);
    return state;
  }

  public prompt(state: State, prompts: Prompt<any>[] | Prompt<any>, then: (results: any) => void): State {
    if (!(prompts instanceof Array)) {
      prompts = [prompts];
    }

    for (let i = 0; i < prompts.length; i++) {
      const id = generateId(state.prompts);
      prompts[i].id = id;
      state.prompts.push(prompts[i]);
    }

    const promptItem: PromptItem = {
      ids: prompts.map(prompt => prompt.id),
      then: then
    };

    this.promptItems.push(promptItem);
    return state;
  }

  public log(state: State, message: string, client?: number, level?: StateLogLevel): void {
    const log = new StateLog(message, client, level);
    log.id = ++this.logId;
    state.logs.push(log);
  }

  private reducePrompt(state: State, action: ResolvePromptAction): State {
    // Resolve prompts actions
    const prompt = state.prompts.find(item => item.id === action.id);
    const promptItem = this.promptItems.find(item => item.ids.indexOf(action.id) !== -1);

    if (prompt === undefined || promptItem === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    if (prompt.result !== undefined) {
      throw new GameError(GameMessage.PROMPT_ALREADY_RESOLVED);
    }

    prompt.result = action.result;

    const results = promptItem.ids.map(id => {
      const p = state.prompts.find(item => item.id === id);
      return p === undefined ? undefined : p.result;
    });

    if (results.every(result => result !== undefined)) {
      const itemIndex = this.promptItems.indexOf(promptItem);
      this.promptItems.splice(itemIndex, 1);
      promptItem.then(results.length === 1 ? results[0] : results);
    }

    if (action.log !== undefined) {
      this.log(state, action.log.message, action.log.client, action.log.level);
    }

    return state;
  }

  private reduce(state: State, action: Action): State {
    state = setupPhaseReducer(this, state, action);
    state = playerTurnReducer(this, state, action);
    return state;
  }

}
