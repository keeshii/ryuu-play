import { Action } from "./actions/action";
import { Prompt } from "./promts/prompt";

export interface StoreLike {
  notify(): void;
  dispatch(action: Action): Promise<void>;
  resolve<T>(prompt: Prompt<T>): Promise<T>;
}
