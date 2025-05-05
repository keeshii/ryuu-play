import { Game } from '../core/game';
import { State } from '@ptcg/common';

export interface GameClient {

  onStateChange(game: Game, state: State): void;

}
