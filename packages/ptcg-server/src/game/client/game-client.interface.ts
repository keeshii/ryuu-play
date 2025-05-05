import { Game } from '../core/game';
import { State } from '../store/state/state';

export interface GameClient {

  onStateChange(game: Game, state: State): void;

}
