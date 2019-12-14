import { BotClient } from './bot-client';
import { Core } from '../core/core';
import { GameError, GameMessage } from '../game-error';
import { User } from '../../storage';

export class BotManager {

  private static instance: BotManager;

  private bots: BotClient[] = [];

  public static getInstance(): BotManager {
    if (!BotManager.instance) {
      BotManager.instance = new BotManager();
    }

    return BotManager.instance;
  }

  public registerBot(bot: BotClient): void {
    this.bots.push(bot);
  }

  public async initBots(core: Core) {
    for (let i = 0; i < this.bots.length; i++) {
      let bot = this.bots[i];
      let user = await this.findOrCreateUser(bot.name);
      bot.user = user;
      core.connect(bot);
    }
  }

  public getBot(botName: string): BotClient {
    const bot = this.bots.find(bot => bot.user.name === botName);
    if (bot === undefined) {
      throw new GameError(GameMessage.BOT_NOT_FOUND);
    }
    return bot;
  }

  private async findOrCreateUser(name: string): Promise<User> {
    let user = await User.findOne({name});
    if (user === undefined) {
      user = new User();
      user.name = name;
      await User.insert(user);
    }
    return user;
  }

}
