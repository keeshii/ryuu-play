import { Bot } from './bot';
import { LobbyRoom } from '../rooms/lobby-room';
import { User } from '../../storage';

export type BotClass = new (user: User, game: LobbyRoom) => Bot;

export class BotManager {

  private static instance: BotManager;

  private botsQueue: Array<{name: string, botClass: BotClass}> = [];
  private bots: Bot[] = [];

  public static getInstance(): BotManager {
    if (!BotManager.instance) {
      BotManager.instance = new BotManager();
    }

    return BotManager.instance;
  }

  public registerBot<T extends Bot>(name: string, botClass: new () => T): void {
    this.botsQueue.push({name, botClass});
  }

  public async initBots(lobbyRoom: LobbyRoom) {
    const bots: Bot[] = [];
    for (let i = 0; i < this.botsQueue.length; i++) {
      let item = this.botsQueue[i];
      let user = await this.findOrCreateUser(item.name);
      bots.push(new item.botClass(user, lobbyRoom));
    }
    this.bots = bots;
  }

  public getBot(botName: string): Bot {
    const bot = this.bots.find(bot => bot.user.name === botName);

    if (bot === undefined) {
      throw new Error('Bot name `' + botName + '` not found');
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
