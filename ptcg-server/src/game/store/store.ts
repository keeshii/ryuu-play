import { Action } from "./actions/action";
import { Prompt } from "./prompts/prompt";
import { State } from "./state/state";
import { StoreHandler } from "./store-handler";
import { StoreLike } from "./store-like";

import { setupPhaseReducer } from './reducers/setup-reducer';

export class Store implements StoreLike {

  public state: State = new State();
  public actions: Action[] = [];
  private prompt: Prompt<any> | undefined;
  private serializedState: string;

  constructor(private handler: StoreHandler) {
    this.serializedState = this.serializeState(this.state);
  };

  public async dispatch(action: Action) {
    this.actions.push(action);

    if (this.prompt !== undefined) {
      await this.prompt.promise;
    }

    while (this.actions.length > 0) {
      this.reduce();

      if (this.prompt !== undefined) {
        await this.prompt.promise;
      }
    }
  }

  public resolve<T>(prompt: Prompt<T>): Promise<T> {
    this.prompt = prompt;

    prompt.promise
      .catch(() => {})
      .then(() => { this.prompt = undefined });

    this.notify();
    this.handler.resolvePrompt(prompt);

    return prompt.promise;
  }

  public reduce(): void {
    const action = this.actions.shift();
    
    if (action === undefined) {
      return;
    }

    setupPhaseReducer(this, this.state, action);
    this.notify();
  }

  private notify(): void {
    const serialized = this.serializeState(this.state);
    if (serialized !== this.serializedState) {
      this.serializedState = serialized;
      this.handler.onStateChange(this.state);
    }
  }

  private serializeState(state: State): string {
    // to be more flexible, good for now
    return JSON.stringify(state);
  }

}
