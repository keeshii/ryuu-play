import { BotClient } from './bot-client';
import { Scheduler } from '../../utils/scheduler';
import { config } from '../../config';

interface BotsForGame {
  deck: string[]
  bot1: BotClient,
  bot2: BotClient,
}

export class BotGamesTask {

  private bots: BotClient[] = [];

  constructor(bots: BotClient[]) {
    this.bots = bots;
  }

  public startBotGames() {
    const scheduler = Scheduler.getInstance();
    scheduler.run(async () => {
      const botsForGame = await this.getRandomBotsForGame();

      // Create the game if successfuly selected two bots
      if (botsForGame !== undefined) {
        const { bot1, bot2, deck } = botsForGame;
        bot1.createGame(deck, undefined, bot2);
      }
    }, config.bots.botGamesIntervalCount);
  }

  private async getRandomBotsForGame(): Promise<BotsForGame | undefined> {
    const allBots = this.bots.slice();
    const bots: BotClient[] = [];
    const decks: Array<string[]> = [];

    // Try to select two random bots for the game
    while (bots.length < 2 && allBots.length > 0) {
      const botIndex = Math.round(Math.random() * (allBots.length - 1));
      const bot = allBots[botIndex];
      allBots.splice(botIndex, 1);
      try {
        const deck = await bot.loadDeck();
        bots.push(bot);
        decks.push(deck);
      } catch {
        // continue regardless of error
      }
    }

    // Successfuly selected two bots
    if (bots.length === 2) {
      return { bot1: bots[0], bot2: bots[1], deck: decks[0] };
    }
  }

}
