import { CardManager, Format, GameSettings, Rules } from '@ptcg/common';

import { BotClient } from './bot-client';
import { Scheduler } from '../../utils/scheduler';
import { config } from '../../config';

interface BotsForGame {
  deck: string[]
  bot1: BotClient,
  bot2: BotClient,
  format: Format
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
        const { bot1, bot2, deck, format } = botsForGame;

        // Use rules from given format
        const rules = new Rules(format.rules);
        rules.formatName = format.name;
        const gameSettings = new GameSettings();
        gameSettings.rules = rules;

        bot1.createGame(deck, gameSettings, bot2);
      }
    }, config.bots.botGamesIntervalCount);
  }

  private getFormats(): Format[] {
    const cardManager = CardManager.getInstance();
    const formats = cardManager.getAllFormats().slice();
    const len = formats.length;

    // Shuffle the available formats
    for (let i = len - 1; i > 0; i--) {
      const position = Math.floor(Math.random() * (i+1));
      [formats[i], formats[position]] = [formats[position], formats[i]];
    }

    // Append Unlimited as last format to try
    formats.push({
      name: '',
      cards: cardManager.getAllCards(),
      ranges: [],
      rules: new Rules()
    });

    return formats;
  }

  private async getRandomBotsForGame(): Promise<BotsForGame | undefined> {
    const formats = this.getFormats();

    // Try each format one by one
    for (const format of formats) {
      const allBots = this.bots.slice();
      const bots: BotClient[] = [];
      const decks: Array<string[]> = [];

      // Find two random bots for the game
      while (bots.length < 2 && allBots.length > 0) {
        const botIndex = Math.round(Math.random() * (allBots.length - 1));
        const bot = allBots[botIndex];
        allBots.splice(botIndex, 1);
        try {
          const deck = await bot.loadDeck(format.name);
          bots.push(bot);
          decks.push(deck);
        } catch {
          // No deck available for given format.
          // Continue regardless of error.
        }
      }

      // Successfuly selected two bots
      if (bots.length === 2) {
        return { bot1: bots[0], bot2: bots[1], deck: decks[0], format };
      }
    }
  }

}
