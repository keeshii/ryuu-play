import { Action } from "./actions/action";
import { Prompt } from "./promts/prompt";
import { State } from "./state/state";
import { StoreHandler } from "./store-handler";
import { StoreLike } from "./store-like";

import { initReducer } from './reducers/init-reducer';

export class Store implements StoreLike {

  public state: State = new State();

  public actions: Action[] = [];

  private prompt: Prompt<any> | undefined;

  constructor(private handler: StoreHandler) { };

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

    this.handler.resolvePrompt(prompt);

    return prompt.promise;
  }

  public reduce(): void {
    const action = this.actions.shift();
    
    if (action === undefined) {
      return;
    }

    initReducer(this, this.state, action);
  }

  public notify(): void {
    this.handler.onStateChange(this.state);
  }

}
