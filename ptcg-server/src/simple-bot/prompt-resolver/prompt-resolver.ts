import { Player, State, Action, Prompt } from '../../game';
import { SimpleBotOptions } from '../simple-bot-options';
import { StateScore } from '../state-score/state-score';

export type PromptResolverList = (new (options: SimpleBotOptions) => PromptResolver)[];

export abstract class PromptResolver {

  protected stateScore: StateScore;

  constructor(protected options: SimpleBotOptions) {
    this.stateScore = new StateScore(this.options);
  }

  public abstract resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined;

  protected getStateScore(state: State, playerId: number): number {
    return this.stateScore.getScore(state, playerId);
  }

}
