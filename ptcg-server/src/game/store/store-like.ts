import { Action } from "./actions/action";
import { Prompt } from "./prompts/prompt";

export interface StoreLike {
  dispatch(action: Action): Promise<void>;
  resolve<T>(prompt: Prompt<T>): Promise<T>;
}
