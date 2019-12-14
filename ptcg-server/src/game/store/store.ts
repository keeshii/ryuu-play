import { Action } from "./actions/action";
import { Prompt } from "./prompts/prompt";
import { ResolvePromptAction } from "./actions/resolve-prompt-action";
import { State } from "./state/state";
import { GameError, GameMessage } from "../game-error";
import { StoreHandler } from "./store-handler";
import { StoreLike } from "./store-like";

import { playerTurnReducer } from "./reducers/player-turn-reducer";
import { setupPhaseReducer } from './reducers/setup-reducer';
import { generateId } from "../../utils/utils";

interface PromptPromise<T> {
  resolve: (value: T) => void;
  reject: (error: Error) => void;
  promise: Promise<T>;
}

export class Store implements StoreLike {

  public state: State = new State();
  private promptMap: {[id: number]: PromptPromise<any>} = {};

  constructor(private handler: StoreHandler) { };

  public dispatch(action: Action): void {
    if (action instanceof ResolvePromptAction) {
      this.reducePrompt(action);
      return;
    }

    if (this.state.prompts.length > 0) {
      throw new GameError(GameMessage.ACTION_IN_PROGRESS);
    }

    try {
      this.reduce(action);
    } catch (storeError) {
      // Illegal action
      throw storeError;
    }

    this.handler.onStateChange(this.state);
  }

  public prompt<T>(prompt: Prompt<T>): Promise<T> {
    const id = generateId(this.state.prompts);
    prompt.id = id;

    const promptPromise: PromptPromise<T> = {} as any;
    promptPromise.promise = new Promise<T>((resolve, reject) => {
      promptPromise.resolve = resolve;
      promptPromise.reject = reject;
    });

    promptPromise.promise.then(() => {
      const index = this.state.prompts.indexOf(prompt);
      this.state.prompts.splice(index, 1);
      delete this.promptMap[id];
    });

    this.promptMap[id] = promptPromise;
    this.state.prompts.push(prompt);
    this.handler.onStateChange(this.state);
    return promptPromise.promise;
  }

  private reducePrompt(action: ResolvePromptAction): void {
    // Resolve prompts actions
    const prompt = this.state.prompts.find(item => item.id === action.prompt.id);
    const promptPromise = this.promptMap[action.prompt.id];

    if (prompt === undefined || promptPromise === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    promptPromise.resolve(action.prompt.result);

    const index = this.state.prompts.indexOf(prompt);
    this.state.prompts.splice(index, 1);
  }

  private reduce(action: Action): void {
    if (this.state.prompts.length > 0) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    setupPhaseReducer(this, this.state, action);
    playerTurnReducer(this, this.state, action);
  }

}
