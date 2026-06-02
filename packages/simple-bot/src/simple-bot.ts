import { SimpleBotOptions } from './simple-bot-options';
import { allSimpleTactics, allPromptResolvers, defaultStateScores,
  defaultArbiterOptions } from './simple-bot-definitions';
import { BotPlayer, BotPlayerAi } from '@ptcg/common';
import { SimpleTacticsAi } from './simple-tactics-ai';


export class SimpleBot extends BotPlayer {

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

  public createBotAiInstance(playerId: number, deck: string[] | null): BotPlayerAi {
    return new SimpleTacticsAi(playerId, this.options, deck);
  }

}
