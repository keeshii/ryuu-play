import { Player, State, PassTurnAction, Action, GamePhase, Prompt,
  InvitePlayerPrompt, StateLog, ResolvePromptAction, GameLog } from '../game';
import { Client } from '../game/client/client.interface';
import { PromptResolver } from './prompt-resolver/prompt-resolver';
import { SimpleTactic } from './simple-tactics/simple-tactics';
import { SimpleBotOptions } from './simple-bot-options';
import { Simulator } from '../game/bots/simulator';

export class SimpleTacticsAi {

  private tactics: SimpleTactic[];
  private resolvers: PromptResolver[];

  constructor(
    private client: Client,
    options: SimpleBotOptions,
    private deck: string[] | null
  ) {
    this.tactics = options.tactics.map(tactic => new tactic(options));
    this.resolvers = options.promptResolvers.map(resolver => new resolver(options));
  }

  public decodeNextAction(state: State): Action | undefined {
    let player: Player | undefined;
    for (let i = 0; i < state.players.length; i++) {
      if (state.players[i].id === this.client.id) {
        player = state.players[i];
      }
    }

    if (player === undefined) {
      return;
    }

    if (state.prompts.length > 0) {
      const playerId = player.id;
      const prompt = state.prompts.find(p => p.playerId === playerId && p.result === undefined);
      if (prompt !== undefined) {
        return this.resolvePrompt(player, state, prompt);
      }
    }

    // Wait for other players to resolve the prompts.
    if (state.prompts.filter(p => p.result === undefined).length > 0) {
      return;
    }

    const activePlayer = state.players[state.activePlayer];
    const isMyTurn = activePlayer.id === this.client.id;
    if (state.phase === GamePhase.PLAYER_TURN && isMyTurn) {
      return this.decodePlayerTurnAction(player, state);
    }
  }

  private decodePlayerTurnAction(player: Player, state: State): Action {
    for (let i = 0; i < this.tactics.length; i++) {
      const action = this.tactics[i].useTactic(state, player);
      if (action !== undefined && this.isValidAction(state, action)) {
        return action;
      }
    }

    return new PassTurnAction(this.client.id);
  }

  public resolvePrompt(player: Player, state: State, prompt: Prompt<any>): Action {
    if (prompt instanceof InvitePlayerPrompt) {
      const result = this.deck;
      let log: StateLog | undefined;
      if (result === null) {
        log = new StateLog(GameLog.LOG_TEXT, {
          text: 'Sorry, my deck is not ready.'
        }, player.id);
      }
      return new ResolvePromptAction(prompt.id, result, log);
    }

    for (let i = 0; i < this.resolvers.length; i++) {
      const action = this.resolvers[i].resolvePrompt(state, player, prompt);
      if (action !== undefined) {
        return action;
      }
    }

    // Unknown prompt type. Try to cancel it.
    return new ResolvePromptAction(prompt.id, null);
  }

  private isValidAction(state: State, action: Action): boolean {
    try {
      const simulator = new Simulator(state);
      simulator.dispatch(action);
    } catch (error) {
      return false;
    }
    return true;
  }

}
