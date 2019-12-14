import { Action } from "./actions/action";
import { Prompt } from "./prompts/prompt";

export interface StoreLike {
  dispatch(action: Action): void;
  prompt<T>(prompt: Prompt<T>): Promise<T>;
}
