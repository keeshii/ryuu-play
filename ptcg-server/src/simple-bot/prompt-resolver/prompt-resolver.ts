import { Player, State, Action, Prompt } from '../../game';
import { SimpleBotOptions } from '../simple-bot-options';

export type PromptResolverList = (new (options: SimpleBotOptions) => PromptResolver)[];

export abstract class PromptResolver {

  constructor(protected options: SimpleBotOptions) { }

  public abstract resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined;

}
