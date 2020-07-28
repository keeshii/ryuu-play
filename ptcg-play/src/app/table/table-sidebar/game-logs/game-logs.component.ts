import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { GameState, StateLog } from 'ptcg-server';
import { GameService } from '../../../api/services/game.service';

interface GameLog {
  id: number;
  name: string;
  className: string;
  message: string;
}

@Component({
  selector: 'ptcg-game-logs',
  templateUrl: './game-logs.component.html',
  styleUrls: ['./game-logs.component.scss']
})
export class GameLogsComponent implements OnInit {

  private readonly LOG_COUNT_LIMIT = 50;

  public loading = true;
  public logs: GameLog[] = [];
  public message = '';
  private state: GameState;

  @Input() set gameState(gameState: GameState) {
    if (!gameState || !gameState.state) {
      this.logs = [];
      return;
    }
    this.state = gameState;
    this.appendLogs(gameState.state.logs);
  }

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private gameService: GameService
  ) { }

  ngOnInit() {
  }

  public clearLogs() {
    this.logs = [];
  }

  public sendMessage() {
    if (!this.state) {
      return;
    }
    this.gameService.appendLogAction(this.state.gameId, this.message);
    this.message = '';
  }

  private appendLogs(logs: StateLog[]) {
    if (logs.length === 0 || !this.state) {
      return;
    }
    let logsAdded = false;

    // Append logs, skip the existing one
    logs.forEach(log => {
      if (this.logs.find(log2 => log2.id === log.id) === undefined) {
        const gameLog = this.buildGameLog(log);
        if (gameLog !== undefined) {
          this.logs.push(gameLog);
          logsAdded = true;
        }
      }
    });

    if (!logsAdded) {
      return;
    }

    // Sort logs by their id
    this.logs.sort((a, b) => a.id - b.id);

    // Remove logs over the limit
    if (this.logs.length > this.LOG_COUNT_LIMIT) {
      const toDelete = this.logs.length - this.LOG_COUNT_LIMIT;
      this.logs.splice(0, toDelete);
    }

    this.scrollToBottom();
  }

  private buildGameLog(log: StateLog): GameLog | undefined {
    let name: string;
    let className: string;

    const user = this.state.users.find(u => u.clientId === log.client);
    const playerIndex = this.state.state.players.findIndex(p => p.id === log.client);

    if (user !== undefined) {
      name = user.name;
      className = playerIndex >= 0
        ? `ptcg-player${playerIndex + 1}`
        : 'ptcg-spectator';
      return {
        id: log.id,
        name,
        className,
        message: log.message
      };
    } else if (log.client === 0) {
      return {
        id: log.id,
        name: 'System',
        className: 'ptcg-system',
        message: log.message
      };
    }
    return undefined;
  }

  private scrollToBottom(): void {
    try {
      const scollablePane = this.elementRef.nativeElement
        .getElementsByClassName('ptcg-game-logs-content')[0] as HTMLElement;
      setTimeout(() => {
        scollablePane.scrollTop = scollablePane.scrollHeight;
      });
    } catch (err) { }
  }

}
