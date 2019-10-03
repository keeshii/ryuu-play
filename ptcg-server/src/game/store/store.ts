import { Action } from "./actions/action";
import { Prompt } from "./promts/prompt";
import { State } from "./state/state";
import {StoreHandler} from "./store-handler";

export class Store {

  public state: State = new State();
  
  public actions: Action[] = [];

  public dispatch(action: Action) { }

  public resolve<T>(prompt: Prompt<T>): Promise<T> { return prompt.promise; }

  public reduce(): void { }

  public subscribe(handler: StoreHandler): void { }

  public unsubscribe(handler: StoreHandler): void { }

}
