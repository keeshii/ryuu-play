import { Card } from "../card/card";
import { GameError } from "../../game-error";
import { GameMessage } from "../../game-message";
import { Prompt } from "./prompt";
import { PlayerType, SlotType, CardTarget } from "../actions/play-card-action";
import { State } from "../state/state";
import { CardList } from "../state/card-list";
import { FilterType } from "./choose-cards-prompt";

export const AttachEnergyPromptType = 'Attach energy';

export interface AttachEnergyOptions {
  allowCancel: boolean;
  min: number;
  max: number;
  blocked: number[];
  blockedTo: CardTarget[];
  sameTarget: boolean;
  differentTargets: boolean;
}

export type AttachEnergyResultType = {to: CardTarget, index: number}[];

export interface CardAssign {
  to: CardTarget;
  card: Card;
}

export class AttachEnergyPrompt extends Prompt<CardAssign[]> {

  readonly type: string = AttachEnergyPromptType;

  public options: AttachEnergyOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public cardList: CardList,
    public playerType: PlayerType,
    public slots: SlotType[],
    public filter: FilterType,
    options?: Partial<AttachEnergyOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: true,
      min: 0,
      max: cardList.cards.length,
      blocked: [],
      blockedTo: [],
      sameTarget: false,
      differentTargets: false
    }, options);
  }

  public decode(result: AttachEnergyResultType | null, state: State): CardAssign[] | null {
    if (result === null) {
      return result;  // operation cancelled
    }
    const player = state.players.find(p => p.id === this.playerId);
    if (player === undefined) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    const transfers: CardAssign[] = [];
    result.forEach(t => {
      const cardList = this.cardList;
      const card = cardList.cards[t.index];
      transfers.push({ to: t.to, card });
    });
    return transfers;
  }

  public validate(result: CardAssign[] | null): boolean {
    if (result === null) {
      return this.options.allowCancel;  // operation cancelled
    }
    if (result.length < this.options.min || result.length > this.options.max) {
      return false;
    }

    // Check if all targets are the same
    if (this.options.sameTarget && result.length > 1) {
      const t = result[0].to;
      const different = result.some(r => {
        return r.to.player !== t.player
          || r.to.slot !== t.slot
          || r.to.index !== t.index
      });
      if (different) {
        return false;
      }
    }

    // Check if all selected targets are different
    if (this.options.differentTargets && result.length > 1) {
      for (let i = 0; i < result.length; i++) {
        const t = result[i].to;
        const index = result.findIndex(r => {
          return r.to.player === t.player
            && r.to.slot === t.slot
            && r.to.index === t.index
        });
        if (index !== i) {
          return false;
        }
      }
    }

    return result.every(r => r.card !== undefined);
  }

}
