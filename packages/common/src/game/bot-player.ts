import { Action, Player, Prompt, State } from '../store';

export interface BotPlayerAi {
  decodeNextAction(state: State): Action | undefined;

  resolvePrompt(player: Player, state: State, prompt: Prompt<any>): Action;
}


export abstract class BotPlayer {
  constructor(public name: string) { }

  public abstract createBotAiInstance(playerId: number, deck: string[] | null): BotPlayerAi;
}
