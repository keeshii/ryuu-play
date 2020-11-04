import { GameError } from "../../game-error";
import { GameMessage } from "../../game-message";
import { Prompt } from "./prompt";
import { PlayerType, SlotType, CardTarget } from "../actions/play-card-action";
import { State } from "../state/state";
import { StateUtils } from "../state-utils";

export const MoveDamagePromptType = 'Move damage';

export type MoveDamageResultType = DamageTransfer[];

export interface DamageTransfer {
  from: CardTarget;
  to: CardTarget;
}

export interface DamageMap {
  target: CardTarget;
  damage: number;
}

export interface MoveDamageOptions {
  allowCancel: boolean;
  min: number;
  max: number | undefined;
  blockedFrom: CardTarget[];
  blockedTo: CardTarget[];
}

export class MoveDamagePrompt extends Prompt<DamageTransfer[]> {

  readonly type: string = MoveDamagePromptType;

  public options: MoveDamageOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public playerType: PlayerType,
    public slots: SlotType[],
    public maxAllowedDamage: DamageMap[],
    options?: Partial<MoveDamageOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: true,
      min: 0,
      max: undefined,
      blockedFrom: [],
      blockedTo: []
    }, options);
  }

  public decode(result: MoveDamageResultType | null, state: State): DamageTransfer[] | null {
    if (result === null) {
      return result;  // operation cancelled
    }
    const player = state.players.find(p => p.id === this.playerId);
    if (player === undefined) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    return result;
  }

  public validate(result: DamageTransfer[] | null, state: State): boolean {
    if (result === null) {
      return this.options.allowCancel;  // operation cancelled
    }

    if (result.length < this.options.min) {
      return false;
    }

    if (this.options.max !== undefined && result.length > this.options.max) {
      return false;
    }

    const player = state.players.find(p => p.id === this.playerId);
    if (player === undefined) {
      return false;
    }
    const blockedFrom = this.options.blockedFrom.map(b => StateUtils.getTarget(state, player, b));
    const blockedTo = this.options.blockedTo.map(b => StateUtils.getTarget(state, player, b));

    for (const r of result) {
      const from = StateUtils.getTarget(state, player, r.from);
      if (from === undefined || blockedFrom.includes(from)) {
        return false;
      }
      const to = StateUtils.getTarget(state, player, r.to);
      if (to === undefined || blockedTo.includes(to)) {
        return false;
      }
    }

    if (this.playerType !== PlayerType.ANY) {
      if (result.some(r => r.from.player !== this.playerType)
        || result.some(r => r.to.player !== this.playerType)) {
        return false;
      }
    }

    if (!result.some(r => this.slots.includes(r.from.slot))
      || !result.some(r => this.slots.includes(r.to.slot))) {
      return false;
    }

    return true;
  }

}
