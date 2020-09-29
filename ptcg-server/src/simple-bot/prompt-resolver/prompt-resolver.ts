import { Player, State, Action, Prompt } from '../../game';
import { SimpleBotOptions } from '../simple-bot-options';
import { StateScoreCalculator } from '../state-score-calculator';

export type PromptResolverList = (new (options: SimpleBotOptions) => PromptResolver)[];

export abstract class PromptResolver {

  private stateScoreCalculator: StateScoreCalculator;

  constructor(protected options: SimpleBotOptions) {
    this.stateScoreCalculator = new StateScoreCalculator(this.options.scores);
  }

  public abstract resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined;

  protected getStateScore(state: State, playerId: number): number {
    return this.stateScoreCalculator.getStateScore(state, playerId);
  }

}
