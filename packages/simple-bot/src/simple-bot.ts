import { SimpleBotOptions } from './simple-bot-options';
import { allSimpleTactics, allPromptResolvers, defaultStateScores,
  defaultArbiterOptions } from './simple-bot-definitions';
import { BotAi, BotAiFactory } from '@ptcg/common';
import { SimpleTacticsAi } from './simple-tactics-ai';


export class SimpleBot extends BotAiFactory {

  private options: SimpleBotOptions;

  constructor(name: string, options: Partial<SimpleBotOptions> = {}) {
    super(name);
    this.options = Object.assign({
      tactics: allSimpleTactics,
      promptResolvers: allPromptResolvers,
      scores: defaultStateScores,
      arbiter: defaultArbiterOptions
    }, options);
  }

  public createBotAi(playerId: number, deck: string[] | null): BotAi {
    return new SimpleTacticsAi(playerId, this.options, deck);
  }

}
