import { Action, BotAi, BotAiFactory } from '@ptcg/common';
import { State } from '@ptcg/common';
import { Client } from '../client/client.interface';
import { Game } from '../core/game';
import { config } from '../../config';

export class BotGameHandler {

  private ai: BotAi | undefined;
  private state: State | undefined;
  private changeInProgress: boolean = false;

  constructor(
    private client: Client,
    private botAiFactory: BotAiFactory,
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

    this.ai = this.botAiFactory.createBotAi(this.client.id, deck);

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
