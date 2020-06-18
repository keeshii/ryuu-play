import { Action } from "./actions/action";
import { Prompt } from "./prompts/prompt";
import { State } from "./state/state";
import { StateLogLevel } from "./state/state-log";

export interface StoreLike {
  dispatch(action: Action): void;

  log(state: State, message: string, client?: number, level?: StateLogLevel): void;

  prompt<T>(
    state: State, prompt: Prompt<T>,
    then: (result: T) => void): State;

  prompt<T>(
    state: State, prompt: [Prompt<T>],
    then: (result: T) => void): State;

  prompt<T, S>(
    state: State, prompt: [Prompt<T>, Prompt<S>],
    then: (result: [T, S]) => void): State;

  prompt<T, S, R>(
    state: State, prompt: [Prompt<T>, Prompt<S>, Prompt<R>],
    then: (result: [T, S, R]) => void): State;

  prompt<T, S, R, P>(
    state: State, prompt: [Prompt<T>, Prompt<S>, Prompt<R>, Prompt<P>],
    then: (result: [T, S, R, P]) => void): State;

  prompt<T>(
    state: State, prompt: Prompt<T>[],
    then: (result: T[]) => void): State;
}
