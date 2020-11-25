import { GameMessage } from "../../game-message";
import { Prompt } from "./prompt";
import { PlayerType, SlotType, CardTarget } from "../actions/play-card-action";
import { State } from "../state/state";
import { StateUtils } from "../state-utils";
import { DamageMap } from "./move-damage-prompt";

export const PutDamagePromptType = 'Put damage';

export interface PutDamageOptions {
  allowCancel: boolean;
  blocked: CardTarget[];
}

export class PutDamagePrompt extends Prompt<DamageMap[]> {

  readonly type: string = PutDamagePromptType;

  public options: PutDamageOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public playerType: PlayerType,
    public slots: SlotType[],
    public damage: number,
    public maxAllowedDamage: DamageMap[],
    options?: Partial<PutDamageOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: true,
      blocked: []
    }, options);
  }

  public decode(result: DamageMap[] | null, state: State): DamageMap[] | null {
    return result;
  }

  public validate(result: DamageMap[] | null, state: State): boolean {
    if (result === null) {
      return this.options.allowCancel;  // operation cancelled
    }

    let damage = 0;
    result.forEach(r => { damage += r.damage; });

    if (this.damage !== damage) {
      return false;
    }

    const player = state.players.find(p => p.id === this.playerId);
    if (player === undefined) {
      return false;
    }
    const blocked = this.options.blocked.map(b => StateUtils.getTarget(state, player, b));

    for (const r of result) {
      const target = StateUtils.getTarget(state, player, r.target);
      if (target === undefined || blocked.includes(target)) {
        return false;
      }
    }

    if (this.playerType !== PlayerType.ANY) {
      if (result.some(r => r.target.player !== this.playerType)) {
        return false;
      }
    }

    if (result.some(r => !this.slots.includes(r.target.slot))) {
      return false;
    }

    return true;
  }

}
