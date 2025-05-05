import { State } from './state/state';

export interface StoreHandler {

  onStateChange(state: State): void;

}
