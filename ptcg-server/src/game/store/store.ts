import { Action } from "./actions/action";
import { Prompt } from "./prompts/prompt";
import { State } from "./state/state";
import { StoreHandler } from "./store-handler";
import { StoreLike } from "./store-like";

import { playerTurnReducer } from "./reducers/player-turn-reducer";
import { setupPhaseReducer } from './reducers/setup-reducer';

export class Store implements StoreLike {

  public state: State = new State();
  public actions: Action[] = [];
  private prompts: Prompt<any>[] = [];
  private serializedState: string;
  private reduceInProgress: boolean = false;

  constructor(private handler: StoreHandler) {
    this.serializedState = this.serializeState(this.state);
  };

  public async dispatch(action: Action) {
    this.actions.push(action);

    if (this.prompts.length > 0 || this.reduceInProgress) {
      return; // action added to queue, will be processed later
    }

    this.reduceInProgress = true;

    while (this.actions.length > 0) {
      await this.reduce();

      if (this.prompts.length > 0) {
        await this.waitForPrompts();
      }
    }

    this.reduceInProgress = false;
    this.notifyStateStable();
  }

  public resolve<T>(prompt: Prompt<T>): Promise<T> {
    this.prompts.push(prompt);

    prompt.promise
      .catch(() => {})
      .then(() => { 
        const index = this.prompts.indexOf(prompt);
        if (index !== -1) {
          this.prompts.splice(index, 1);
        }
        this.notifyStateChange();
      });

    this.handler.resolvePrompt(prompt);

    return prompt.promise;
  }

  public async reduce(): Promise<void> {
    const action = this.actions.shift();
    
    if (action === undefined) {
      return;
    }

    await setupPhaseReducer(this, this.state, action);
    await playerTurnReducer(this, this.state, action);
  }

  private async waitForPrompts(): Promise<any[]> {
    return Promise.all(this.prompts.map(prompt => prompt.promise));
  }

  private notifyStateChange(): void {
    const serialized = this.serializeState(this.state);
    if (serialized !== this.serializedState) {
      this.serializedState = serialized;
      this.handler.onStateChange(this.state);
    }
  }

  private notifyStateStable(): void {
    if (this.prompts.length === 0 && !this.reduceInProgress) {
      this.handler.onStateStable(this.state);
    }
  }

  private serializeState(state: State): string {
    // to be more flexible, good for now
    return JSON.stringify(state);
  }

}
