import { Action } from './actions/action';
import { Effect } from './effects/effect';
import { Prompt } from './prompts/prompt';
import { State } from './state/state';
import { StateLogParam } from './state/state-log';
import { GameLog } from '../game-message';

export interface StoreLike {
  dispatch(action: Action): void;

  reduceEffect(state: State, effect: Effect): State;

  log(state: State, message: GameLog, params?: StateLogParam, client?: number): void;

  waitPrompt(state: State, callback: () => void): State;

  hasPrompts(): boolean;

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
