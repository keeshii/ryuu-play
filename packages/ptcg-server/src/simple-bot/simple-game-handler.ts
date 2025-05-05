import { Action } from '../game/store/actions/action';
import { State } from '../game';
import { Client } from '../game/client/client.interface';
import { Game } from '../game/core/game';
import { SimpleBotOptions } from './simple-bot-options';
import { SimpleTacticsAi } from './simple-tactics-ai';
import { config } from '../config';

export class SimpleGameHandler {

  private ai: SimpleTacticsAi | undefined;
  private state: State | undefined;
  private changeInProgress: boolean = false;

  constructor(
    private client: Client,
    private options: SimpleBotOptions,
    public game: Game,
    deckPromise: Promise<string[]>
  ) {
    this.waitForDeck(deckPromise);
  }

  public async onStateChange(state: State): Promise<void> {
    if (!this.ai || this.changeInProgress) {
      this.state = state;
      return;
    }

    this.state = undefined;
    this.changeInProgress = true;

    const action = this.ai.decodeNextAction(state);
    if (action) {
      await this.waitAndDispatch(action);
    }

    this.changeInProgress = false;
    // A state change was ignored, because we were processing
    if (this.state) {
      this.onStateChange(this.state);
    }
  }

  private async waitForDeck(deckPromise: Promise<string[]>): Promise<void> {
    let deck: string[] | null = null;
    try {
      deck = await deckPromise;
    } catch (error) {
      // continue regardless of error
    }

    this.ai = new SimpleTacticsAi(this.client, this.options, deck);

    // A state change was ignored, because we were loading the deck
    if (this.state) {
      this.onStateChange(this.state);
    }
  }

  private waitAndDispatch(action: Action): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          this.game.dispatch(this.client, action);
        } catch (error) {
          // continue regardless of error
        }
        resolve();
      }, config.bots.actionDelay);
    });
  }

}
