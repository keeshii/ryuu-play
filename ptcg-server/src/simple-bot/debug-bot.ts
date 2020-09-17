import { Game } from '../game/core/game';
import { SimpleBot } from './main';
import { Client } from '../game/client/client.interface';

export class DebugBot extends SimpleBot {

  public onGameLeave(game: Game, client: Client): void {
    if (!this.core) {
      return;
    }
    const gameHandler = this.gameHandlers.find(gh => gh.game === game);
    if (gameHandler === undefined) {
      return;
    }
    if (game.clients.length === 1 && game.clients[0].id === this.id) {
      this.core.leaveGame(this, game);
    }
  }

  public static createSampleDeck(): string[] {
    const deck = [];
    for (let i = 0; i < 56; i++) {
      deck.push('Water Energy EVO');
    }
    for (let i = 0; i < 4; i++) {
      deck.push('Buizel GE');
    }
    return deck;
  }

}
